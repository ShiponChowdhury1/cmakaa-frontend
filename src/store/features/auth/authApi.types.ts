import type { AuthUser } from './authSlice';

/* ── Request Types ── */

export interface SignupBankerRequest {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
  flow: 'register' | 'forgot-password';
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResendOtpRequest {
  email: string;
}

/* ── Response Types ── */

/** Generic API response wrapper */
export interface ApiResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/** Login response — token + refreshToken + user */
export interface LoginResponseData {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

/** Forgot password response */
export interface ForgotPasswordResponseData {
  email: string;
  status: string;
}

/** OTP verify response — forgot-password flow returns a reset token */
export interface VerifyOtpResponseData {
  token?: string;
}

/** Refresh response — returns new token + refreshToken + user */
export interface RefreshResponseData {
  token: string;
  refreshToken: string;
  user: AuthUser;
}
