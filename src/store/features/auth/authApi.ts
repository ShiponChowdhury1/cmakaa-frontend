import { baseApi } from '../../api/baseApi';
import type {
  SignupBankerRequest,
  LoginRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendOtpRequest,
  ApiResponse,
  LoginResponseData,
  ForgotPasswordResponseData,
  VerifyOtpResponseData,
  RefreshResponseData,
} from './authApi.types';

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
