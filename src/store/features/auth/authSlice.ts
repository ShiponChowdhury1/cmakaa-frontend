import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/* ── Types ── */
export interface AuthUser {
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
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

/* ── Initial State ──
 * accessToken lives ONLY in Redux memory.
 * refreshToken is an HttpOnly cookie set by the backend —
 * the frontend never reads or stores it.
 * On page refresh → /auth/refresh endpoint is hit to get a new accessToken.
 */
const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

/* ── Slice ── */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called after a successful login.
     * Backend returns token in the response body;
     * refreshToken is set as an HttpOnly cookie automatically.
     */
    setCredentials(
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
      }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },

    /**
     * Called after a silent refresh (/auth/refresh).
     * Updates only the in-memory accessToken.
     */
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },

    /**
     * Called when user data is returned (e.g. /auth/me or refresh).
     */
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },

    /**
     * Clears all auth state.
     */
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, setAccessToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
