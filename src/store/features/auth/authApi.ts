import { baseApi } from '../../api/baseApi';
import type { AuthUser } from './authSlice';

/* ── Request Types ── */

interface SignupBankerRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
  flow: 'register' | 'forgot-password';
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

interface ResendOtpRequest {
  email: string;
}

/* ── Response Types ── */

/** Generic API response wrapper */
interface ApiResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/** Login response — token + refreshToken + user */
interface LoginResponseData {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

/** Forgot password response */
interface ForgotPasswordResponseData {
  email: string;
  status: string;
}

/** OTP verify response — forgot-password flow returns a reset token */
interface VerifyOtpResponseData {
  token?: string;
}

/** Refresh response — returns new token + refreshToken + user */
interface RefreshResponseData {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

/* ── Auth API ── */

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /auth/signup-banker
    signupBanker: builder.mutation<ApiResponse, SignupBankerRequest>({
      query: (body) => ({
        url: '/auth/signup-banker',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/login
    login: builder.mutation<ApiResponse<LoginResponseData>, LoginRequest>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/verify-otp
    verifyOtp: builder.mutation<ApiResponse<VerifyOtpResponseData | null>, VerifyOtpRequest>({
      query: (body) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/resend-otp
    resendOtp: builder.mutation<ApiResponse, ResendOtpRequest>({
      query: (body) => ({
        url: '/auth/resend-otp',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/forgot-password
    forgotPassword: builder.mutation<ApiResponse<ForgotPasswordResponseData>, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/reset-password
    resetPassword: builder.mutation<ApiResponse, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
    }),

    // POST /auth/refresh-token
    refresh: builder.mutation<ApiResponse<RefreshResponseData>, void>({
      query: () => ({
        url: '/auth/refresh-token',
        method: 'POST',
      }),
    }),

    // POST /auth/logout — clears HttpOnly cookie server-side
    serverLogout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useSignupBankerMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshMutation,
  useServerLogoutMutation,
} = authApi;
