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
  refreshToken: string | null;
  isAuthenticated: boolean;
}

/* ── LocalStorage helpers ── */
const AUTH_STORAGE_KEY = 'cmakaa_auth';

function loadAuthFromStorage(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as {
        user: AuthUser | null;
        accessToken: string | null;
        refreshToken: string | null;
      };
      if (parsed.accessToken) {
        return {
          user: parsed.user,
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken ?? null,
          isAuthenticated: true,
        };
      }
    }
  } catch {
    // corrupted storage — start fresh
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
  return { user: null, accessToken: null, refreshToken: null, isAuthenticated: false };
}

function saveAuthToStorage(state: AuthState) {
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    );
  } catch {
    // storage full or blocked — silently ignore
  }
}

function clearAuthFromStorage() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/* ── Initial State ──
 * On app load we rehydrate from localStorage so the user
 * stays logged-in across page reloads.
 */
const initialState: AuthState = loadAuthFromStorage();

/* ── Slice ── */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Called after a successful login or token refresh.
     * Stores token + refreshToken + user in Redux AND localStorage.
     */
    setCredentials(
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken?: string;
      }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      state.isAuthenticated = true;
      saveAuthToStorage(state);
    },

    /**
     * Called after a silent refresh (/auth/refresh).
     * Updates only the in-memory accessToken.
     */
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      saveAuthToStorage(state);
    },

    /**
     * Called when user data is returned (e.g. /auth/me or refresh).
     */
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      saveAuthToStorage(state);
    },

    /**
     * Clears all auth state + localStorage.
     */
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      clearAuthFromStorage();
    },
  },
});

export const { setCredentials, setAccessToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
