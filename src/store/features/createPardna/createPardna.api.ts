import { baseApi } from '../../api/baseApi';
import type {
  Pardna,
  CreatePardnaRequest,
  GetPardnasResponse,
  CreatePardnaResponse,
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
  }),
});

export const {
  useGetPardnasQuery,
  useGetPardnaByIdQuery,
  useCreatePardnaMutation,
} = createPardnaApi;
