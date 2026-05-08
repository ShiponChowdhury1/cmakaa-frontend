import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLoginMutation } from '@/store/features/auth/authApi';
import { useAppDispatch } from '@/store';
import { setCredentials } from '@/store/features/auth/authSlice';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const e: { identifier?: string; password?: string } = {};
    if (!identifier.trim()) e.identifier = 'Email or phone is required';
    if (!password) e.password = 'Password is required';
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
      const result = await login({
        email: identifier,
        password,
      }).unwrap();

      if (result.success && result.data) {
        // Store token + user in Redux memory only
        dispatch(
          setCredentials({
            user: result.data.user,
            accessToken: result.data.token,
          }),
        );

        // Redirect based on user role
        const role = result.data.user.role?.toUpperCase();
        if (role === 'ADMIN') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || 'Login failed. Please try again.';
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
          Welcome back
        </h1>
        <p className="text-[var(--color-gray-500)] text-sm">
          Log in to manage your pardnas
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
          {/* Email or phone */}
          <div>
            <label
              htmlFor="login-identifier"
              className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
            >
              Email or phone
            </label>
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              placeholder="you@example.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={`${inputClass} ${errors.identifier ? 'border-[var(--color-error)]' : ''}`}
            />
            {errors.identifier && (
              <p className="mt-2 text-xs text-[var(--color-error)]">{errors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="login-password"
                className="text-sm font-semibold text-[var(--color-dark)]"
              >
                Password
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-xs font-medium text-[var(--color-primary)] hover:underline no-underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
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
              <p className="mt-1 text-xs text-[var(--color-error)]">{errors.password}</p>
            )}
          </div>

          {/* Remember me */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div className="relative shrink-0">
              <input type="checkbox" className="sr-only" />
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                  rememberMe
                    ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                    : 'border-[var(--color-gray-300)] bg-white hover:border-[var(--color-primary)]'
                }`}
              >
                {rememberMe && (
                  <svg width="9" height="7" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-[var(--color-gray-500)]">Remember me on this device</span>
          </label>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            className="rounded-xl"
          >
            Log in
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-[var(--color-gray-400)] font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Enter as Admin */}
          <Link
            to="/admin"
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-semibold text-[var(--color-dark)] bg-white border border-[var(--color-gray-200)] rounded-xl hover:bg-[var(--color-gray-100)] hover:border-[var(--color-gray-300)] transition-all no-underline"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Enter as Admin
          </Link>
        </form>
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm text-[var(--color-gray-400)] mt-6">
        Don't have an account?{' '}
        <Link
          to="/auth/register"
          className="text-[var(--color-primary)] font-semibold hover:underline no-underline"
        >
          Sign up as a banker
        </Link>
      </p>
    </div>
  );
}
