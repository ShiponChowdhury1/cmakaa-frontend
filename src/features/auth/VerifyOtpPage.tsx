import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpInput from '@/components/ui/OtpInput';
import Button from '@/components/ui/Button';
import { useCountdown } from '@/hooks/useCountdown';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/store/features/auth/authApi';

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, flow } = (location.state as { email?: string; flow?: string }) || {};
  const displayEmail = email || '';
  const isForgotPassword = flow === 'forgot-password';

  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useResendOtpMutation();

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { display, isActive, restart } = useCountdown(120);

  const handleOtpComplete = (value: string) => {
    setOtp(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (otp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      const result = await verifyOtp({
        email: displayEmail,
        otp,
        flow: isForgotPassword ? 'forgot-password' : 'register',
      }).unwrap();

      if (result.success) {
        if (isForgotPassword) {
          // Forgot password flow → OTP verify returns a reset token
          const resetToken = result.data?.token || '';
          navigate('/auth/new-password', {
            replace: true,
            state: { email: displayEmail, token: resetToken },
          });
        } else {
          // Register flow → account verified → go to login
          navigate('/auth/login', { replace: true });
        }
      }
    } catch (err: any) {
      const msg = err?.data?.message || 'Invalid OTP. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!displayEmail) return;
    setError('');
    setSuccessMsg('');
    setIsResending(true);

    try {
      const result = await resendOtp({ email: displayEmail }).unwrap();
      if (result.success) {
        setSuccessMsg('OTP resent successfully!');
        restart();
      }
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to resend OTP.';
      setError(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[var(--color-dark)] mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {isForgotPassword ? 'Reset password' : 'Verify OTP'}
        </h1>
        <p className="text-[var(--color-gray-500)] text-sm">
          Enter the 6-digit code sent to
        </p>
        <p className="text-[var(--color-dark)] font-semibold text-sm mt-1">
          {displayEmail}
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-lg)] border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <OtpInput length={6} onComplete={handleOtpComplete} />
          </div>

          {error && (
            <p className="text-sm text-[var(--color-error)] text-center mb-4">{error}</p>
          )}

          {successMsg && (
            <p className="text-sm text-[var(--color-success)] text-center mb-4">{successMsg}</p>
          )}

          {/* Countdown / Resend */}
          <div className="text-center mb-6">
            {isActive ? (
              <p className="text-sm text-[var(--color-gray-500)]">
                Resend code in <span className="font-bold text-[var(--color-dark)]">{display}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-medium text-[var(--color-primary)] hover:underline cursor-pointer bg-transparent border-none disabled:opacity-50"
              >
                {isResending ? 'Resending…' : 'Resend OTP'}
              </button>
            )}
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            className="rounded-xl"
          >
            Verify & Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
