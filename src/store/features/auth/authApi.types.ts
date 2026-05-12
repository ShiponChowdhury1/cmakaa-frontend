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

export interface UpdateProfileData {
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface UpdateProfileRequest {
  data: UpdateProfileData;
  profilePicture?: File | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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

/** Current user profile response from /user/me */
export interface MeResponseData {
  id: string;
  role: string;
  username: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  profilePicture: string | null;
  addressId: string | null;
  kycStatus: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
