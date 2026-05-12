import { baseApi } from '../../api/baseApi';
import type {
  User,
  UsersResponse,
  SingleUserResponse,
  UsersQueryParams,
} from './usersApi.types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /getBankers
    getBankers: builder.query<UsersResponse, UsersQueryParams | void>({
      query: (params) => ({
        url: '/getBankers',
        params: params ?? undefined,
      }),
      providesTags: ['Users'],
    }),

    // GET /getParticipants
    getParticipants: builder.query<UsersResponse, UsersQueryParams | void>({
      query: (params) => ({
        url: '/getParticipants',
        params: params ?? undefined,
      }),
      providesTags: ['Users'],
    }),

    // GET user by ID
    getUserById: builder.query<SingleUserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    // POST create user
    createUser: builder.mutation<SingleUserResponse, Partial<User>>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    // PUT update user
    updateUser: builder.mutation<SingleUserResponse, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        'Users',
      ],
    }),

    // PATCH user
    patchUser: builder.mutation<SingleUserResponse, { id: string; body: Partial<User> }>({
      query: ({ id, body }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        'Users',
      ],
    }),

    // DELETE user
    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const {
  useGetBankersQuery,
  useGetParticipantsQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  usePatchUserMutation,
  useDeleteUserMutation,
} = usersApi;
