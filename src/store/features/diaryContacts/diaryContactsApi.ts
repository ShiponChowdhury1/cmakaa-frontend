import { baseApi } from '../../api/baseApi';
import type {
  DiaryContact,
  DiaryContactResponse,
  DiaryContactsResponse,
  CreateDiaryContactRequest,
  UpdateDiaryContactRequest,
} from './diaryContactsApi.types';

export const diaryContactsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ── GET all diary contacts ── */
    getDiaryContacts: builder.query<DiaryContact[], void>({
      query: () => ({
        url: '/diary-contacts',
      }),
      transformResponse: (response: DiaryContactsResponse) => response.data,
      providesTags: ['Pardna'], // Using Pardna tag for cache invalidation
    }),

    /* ── GET single diary contact ── */
    getDiaryContact: builder.query<DiaryContact, string>({
      query: (contactId) => ({
        url: `/diary-contacts/${contactId}`,
      }),
      transformResponse: (response: DiaryContactResponse) => response.data,
      providesTags: (_result, _error, contactId) => [{ type: 'Pardna', id: contactId }],
    }),

    /* ── CREATE diary contact ── */
    createDiaryContact: builder.mutation<DiaryContact, CreateDiaryContactRequest>({
      query: (body) => ({
        url: '/diary-contacts',
        method: 'POST',
        body,
      }),
      transformResponse: (response: DiaryContactResponse) => response.data,
      invalidatesTags: ['Pardna'],
    }),

    /* ── UPDATE diary contact ── */
    updateDiaryContact: builder.mutation<
      DiaryContact,
      { contactId: string; data: UpdateDiaryContactRequest }
    >({
      query: ({ contactId, data }) => ({
        url: `/diary-contacts/${contactId}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: DiaryContactResponse) => response.data,
      invalidatesTags: (_result, _error, { contactId }) => [
        'Pardna',
        { type: 'Pardna', id: contactId },
      ],
    }),

    /* ── DELETE diary contact ── */
    deleteDiaryContact: builder.mutation<void, string>({
      query: (contactId) => ({
        url: `/diary-contacts/${contactId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Pardna'],
    }),
  }),
});

export const {
  useGetDiaryContactsQuery,
  useGetDiaryContactQuery,
  useCreateDiaryContactMutation,
  useUpdateDiaryContactMutation,
  useDeleteDiaryContactMutation,
} = diaryContactsApi;
