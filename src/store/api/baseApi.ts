import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import { setCredentials, logout, type AuthUser } from '../features/auth/authSlice';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api';

/* ── Base query with auth header ── */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include', // sends HttpOnly refresh cookie on every request
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/* ── Re-auth wrapper ──
 * If a request fails with 401, try to silently refresh
 * the accessToken using the HttpOnly cookie, then retry.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new accessToken via the refresh-token endpoint
    const refreshResult = await rawBaseQuery(
      { url: '/auth/refresh-token', method: 'POST' },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const res = refreshResult.data as {
        success: boolean;
        data: { token: string; refreshToken: string; user: AuthUser };
      };
      if (res.success && res.data?.token) {
        // Store new accessToken + user in Redux memory
        api.dispatch(
          setCredentials({
            accessToken: res.data.token,
            user: res.data.user,
          }),
        );
        // Retry the original request with the new token
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      // Refresh failed — session expired, force logout
      api.dispatch(logout());
    }
  }

  return result;
};

/* ── API slice ── */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Users', 'Dashboard', 'Pardna', 'Kyc'],
  endpoints: () => ({}),
});
