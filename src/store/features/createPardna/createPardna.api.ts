import { baseApi } from '../../api/baseApi';
import type {
  Pardna,
  CreatePardnaRequest,
  GetPardnasResponse,
  CreatePardnaResponse,
  Round,
  PayoutHistoryEntry,
  PayoutDetailEntry,
} from './createPardna.type';

export const createPardnaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ── GET all pardnas ── */
    getPardnas: builder.query<Pardna[], void>({
      query: () => ({
        url: '/pardnas',
        method: 'GET',
      }),
      transformResponse: (response: GetPardnasResponse) => response.data,
      providesTags: ['Pardna'],
    }),

    /* ── GET single pardna by ID ── */
    getPardnaById: builder.query<Pardna, string>({
      query: (id) => ({
        url: `/pardnas/${id}`,
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; statusCode: number; message: string; data: Pardna }) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Pardna', id }],
    }),

    /* ── CREATE pardna ── */
    createPardna: builder.mutation<Pardna, CreatePardnaRequest>({
      query: (body) => ({
        url: '/pardnas',
        method: 'POST',
        body,
      }),
      transformResponse: (response: CreatePardnaResponse) => response.data,
      invalidatesTags: ['Pardna'],
    }),

    /* ── GET active round by Pardna ID ── */
    getActiveRoundByPardnaId: builder.query<Round, string>({
      query: (pardnaId) => ({
        url: `/rounds/pardna/${pardnaId}/active`,
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; statusCode: number; message: string; data: Round }) => response.data,
      providesTags: (_result, _error, pardnaId) => [
        { type: 'Payments', id: pardnaId },
        { type: 'Payouts', id: pardnaId },
        { type: 'Pardna', id: pardnaId }
      ],
    }),

    /* ── RECORD payment ── */
    recordPayment: builder.mutation<
      any,
      {
        roundId: string;
        participantId: string;
        amount: number;
        status: string;
        notes?: string;
        pardnaId?: string; // used for optimistic cache update only
      }
    >({
      query: ({ pardnaId: _pardnaId, ...body }) => ({
        url: '/pardna-payments',
        method: 'POST',
        body: {
          ...body,
          notes: body.notes || 'N/A',
        },
      }),
      invalidatesTags: (_result, _error, { pardnaId }) => [
        'Payments',
        'Pardna',
        ...(pardnaId ? [{ type: 'Payments' as const, id: pardnaId }] : []),
      ],
      /* Optimistic update — instantly mark PAID in the UI */
      async onQueryStarted({ pardnaId, participantId }, { dispatch, queryFulfilled }) {
        if (!pardnaId) return;

        const patchResult = dispatch(
          createPardnaApi.util.updateQueryData('getActiveRoundByPardnaId', pardnaId, (draft) => {
            if (draft?.payments) {
              const payment = draft.payments.find((p) => p.participant?.id === participantId);
              if (payment) {
                payment.status = 'PAID';
                payment.paidAt = new Date().toISOString();
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // rollback on failure
        }
      },
    }),

    /* ── CONFIRM payout ── */
    confirmPayout: builder.mutation<
      any,
      {
        pardnaId: string;
        roundId: string;
        participantId: string;
        notes?: string;
      }
    >({
      query: (body) => ({
        url: '/pardna-payouts/confirm',
        method: 'PATCH',
        body: {
          ...body,
          notes: body.notes || 'N/A',
        },
      }),
      invalidatesTags: (_result, _error, { pardnaId }) => [
        'Payouts',
        'Pardna',
        { type: 'Payouts', id: pardnaId },
        { type: 'Payments', id: pardnaId },
      ],
      /* Optimistic update — instantly mark CONFIRMED in the UI */
      async onQueryStarted({ pardnaId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          createPardnaApi.util.updateQueryData('getActiveRoundByPardnaId', pardnaId, (draft) => {
            if (draft?.payouts) {
              for (const payout of draft.payouts) {
                if (payout.status !== 'CONFIRMED') {
                  payout.status = 'CONFIRMED';
                  payout.confirmedAt = new Date().toISOString();
                }
              }
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* ── GET payout history ── */
    getPayoutHistory: builder.query<PayoutHistoryEntry[], void>({
      query: () => ({
        url: '/pardna-payouts',
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; statusCode: number; message: string; data: PayoutHistoryEntry[] }) => response.data,
      providesTags: ['Payouts'],
    }),

    /* ── GET single payout by ID ── */
    getPayoutById: builder.query<PayoutDetailEntry, string>({
      query: (payoutId) => ({
        url: `/pardna-payouts/${payoutId}`,
        method: 'GET',
      }),
      transformResponse: (response: { success: boolean; statusCode: number; message: string; data: PayoutDetailEntry }) => response.data,
      providesTags: (_result, _error, payoutId) => [
        { type: 'Payouts', id: payoutId },
        'Payouts'
      ],
    }),
  }),
});

export const {
  useGetPardnasQuery,
  useGetPardnaByIdQuery,
  useCreatePardnaMutation,
  useGetActiveRoundByPardnaIdQuery,
  useRecordPaymentMutation,
  useConfirmPayoutMutation,
  useGetPayoutHistoryQuery,
  useGetPayoutByIdQuery,
} = createPardnaApi;
