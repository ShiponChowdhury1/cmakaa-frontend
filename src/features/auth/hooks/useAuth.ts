import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  phone: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userRole: 'admin' | 'banker' | 'participant' | null;
}

export function useAuth() {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    phone: '',
    isAuthenticated: false,
    isLoading: false,
    error: null,
    userRole: null,
  });

  const sendOtp = useCallback(async (phone: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null, phone }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAuthState((prev) => ({ ...prev, isLoading: false }));
    navigate('/auth/verify-otp', { state: { phone } });
  }, [navigate]);

  const verifyOtp = useCallback(async (otp: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Demo: OTP 123456 = success
    if (otp === '123456') {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        isAuthenticated: true,
        userRole: 'admin',
      }));
      navigate('/admin');
    } else {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Invalid OTP. Please try again.',
      }));
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setAuthState({
      phone: '',
      isAuthenticated: false,
      isLoading: false,
      error: null,
      userRole: null,
    });
    navigate('/');
  }, [navigate]);

  return {
    ...authState,
    sendOtp,
    verifyOtp,
    logout,
  };
}
