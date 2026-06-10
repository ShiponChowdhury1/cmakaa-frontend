import { baseApi } from '../../api/baseApi';
import type {
  KycApplication,
  KycApiResponse,
  SubmitKycRequest,
} from './kycApi.types';

export const kycApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /kyc — Retrieve current user's KYC application.
     * Returns null data if no application exists.
     */
    getMyKyc: builder.query<KycApiResponse<KycApplication | null>, void>({
      query: () => ({
        url: '/kyc',
        method: 'GET',
      }),
      providesTags: ['Kyc'],
    }),

    /**
     * POST /kyc/apply — Submit a new KYC application.
     * Sends multipart/form-data with document images + metadata.
     */
    submitKyc: builder.mutation<KycApiResponse<KycApplication>, SubmitKycRequest>({
      query: ({ documentType, notes, documentFront, documentBack, selfieUrl }) => {
        const formData = new FormData();
        formData.append('documentType', documentType);
        formData.append('notes', notes);
        formData.append('documentFront', documentFront);
        formData.append('documentBack', documentBack);
        formData.append('selfieUrl', selfieUrl);

        return {
          url: '/kyc/apply',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Kyc'],
    }),
  }),
});

export const {
  useGetMyKycQuery,
  useSubmitKycMutation,
} = kycApi;
