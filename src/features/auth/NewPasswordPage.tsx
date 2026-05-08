import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useResetPasswordMutation } from '@/store/features/auth/authApi';

const requirements = [
  { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'One number', test: (pw: string) => /\d/.test(pw) },
  { label: 'One special character', test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

export default function NewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword] = useResetPasswordMutation();

  // Reset token comes from OTP verify response (forgot-password flow)
  const { token: resetToken, email } = (location.state as { token?: string; email?: string }) || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: { password?: string; confirm?: string } = {};
    if (!password || password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setApiError('');
    setIsLoading(true);

    try {
      const result = await resetPassword({
        token: resetToken || '',
        newPassword: password,
      }).unwrap();

      if (result.success) {
        navigate('/auth/login', { replace: true });
      }
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to reset password. Please try again.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3.5 rounded-xl border border-[var(--color-gray-200)] bg-white text-[var(--color-dark)] placeholder:text-[var(--color-gray-400)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--color-primary)] hover:border-[var(--color-gray-300)]';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[var(--color-dark)] mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Set new password
        </h1>
        <p className="text-[var(--color-gray-500)] text-sm">
          Create a strong password for your account
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-lg)] border border-gray-100">
        {/* API Error */}
        {apiError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* New Password */}
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-12 ${errors.password ? 'border-[var(--color-error)]' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] hover:text-[var(--color-dark)] transition-colors cursor-pointer border-none bg-transparent p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-[var(--color-error)]">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`${inputClass} pr-12 ${errors.confirm ? 'border-[var(--color-error)]' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)] hover:text-[var(--color-dark)] transition-colors cursor-pointer border-none bg-transparent p-1"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirm && (
              <p className="mt-2 text-xs text-[var(--color-error)]">{errors.confirm}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="space-y-2 pt-1">
            {requirements.map((req) => {
              const met = req.test(password);
              return (
                <div key={req.label} className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={15}
                    className={`shrink-0 transition-colors ${
                      met ? 'text-[var(--color-success)]' : 'text-[var(--color-gray-300)]'
                    }`}
                  />
                  <span className={`text-xs transition-colors ${
                    met ? 'text-[var(--color-success)]' : 'text-[var(--color-gray-400)]'
                  }`}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            className="rounded-xl"
          >
            Reset password
          </Button>
        </form>
      </div>

      {/* Back to login */}
      <p className="text-center text-sm text-[var(--color-gray-400)] mt-6">
        <Link
          to="/auth/login"
          className="text-[var(--color-dark)] font-medium hover:underline no-underline inline-flex items-center gap-1"
        >
          ← Back to log in
        </Link>
      </p>
    </div>
  );
}
