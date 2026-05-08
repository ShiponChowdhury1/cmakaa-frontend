import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useSignupBankerMutation } from '@/store/features/auth/authApi';

const trustPoints = [
  'No money handling — records only',
  'OTP verification on next step',
  'Your data stays private',
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [signupBanker] = useSignupBankerMutation();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    agreed: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!form.phone.trim() || form.phone.length < 7)
      e.phone = 'Enter a valid phone number';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (!form.agreed) e.agreed = 'You must agree to continue';
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
      const result = await signupBanker({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        phoneNumber: form.phone,
        password: form.password,
      }).unwrap();

      if (result.success) {
        // Signup successful → go to OTP verification
        navigate('/auth/verify-otp', {
          state: { email: form.email, flow: 'register' },
        });
      }
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.message || 'Signup failed. Please try again.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-[var(--color-gray-200)] bg-white text-[var(--color-dark)] placeholder:text-[var(--color-gray-400)] text-sm transition-all duration-200 focus:outline-none focus:border-[var(--color-primary)] hover:border-[var(--color-gray-300)]';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[var(--color-dark)] mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Create your banker account
        </h1>
        <p className="text-[var(--color-gray-500)] text-sm">
          Start organising pardnas with proper records
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

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first-name"
                className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
              >
                First name
              </label>
              <input
                id="first-name"
                type="text"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                className={`${inputClass} ${errors.firstName ? 'border-[var(--color-error)]' : ''}`}
              />
              {errors.firstName && (
                <p className="mt-2 text-xs text-[var(--color-error)]">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="last-name"
                className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
              >
                Last name
              </label>
              <input
                id="last-name"
                type="text"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                className={`${inputClass} ${errors.lastName ? 'border-[var(--color-error)]' : ''}`}
              />
              {errors.lastName && (
                <p className="mt-2 text-xs text-[var(--color-error)]">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
            >
              Username{' '}
              <span className="text-[var(--color-gray-400)] font-normal text-xs">(optional)</span>
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                placeholder="e.g. banker_jay"
                value={form.username}
                onChange={(e) => set('username', e.target.value)}
                className={`${inputClass} pr-28`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--color-gray-400)]">
                @PardnaBook
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--color-gray-400)]">This will be your displayed name</p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              className={`${inputClass} ${errors.email ? 'border-[var(--color-error)]' : ''}`}
            />
            {errors.email && (
              <p className="mt-2 text-xs text-[var(--color-error)]">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
            >
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="+44 7700 900000"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              className={`${inputClass} ${errors.phone ? 'border-[var(--color-error)]' : ''}`}
            />
            {errors.phone && (
              <p className="mt-2 text-xs text-[var(--color-error)]">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
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

          {/* T&C Checkbox */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <div className="relative mt-0.5 shrink-0">
                <input id="agreed" type="checkbox" className="sr-only" />
                <div
                  onClick={() => set('agreed', !form.agreed)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                    form.agreed
                      ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
                      : 'border-[var(--color-gray-300)] bg-white hover:border-[var(--color-primary)]'
                  }`}
                >
                  {form.agreed && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-[var(--color-gray-500)] leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-[var(--color-primary)] hover:underline font-medium">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[var(--color-primary)] hover:underline font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreed && (
              <p className="mt-2 text-xs text-[var(--color-error)] ml-8">{errors.agreed}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-1">
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isLoading}
              className="rounded-xl"
            >
              Create Account
            </Button>
          </div>

          {/* Trust badges */}
          <div className="pt-4 space-y-2 border-t border-gray-100">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-[var(--color-success,#10B981)] shrink-0" />
                <span className="text-xs text-[var(--color-gray-500)]">{point}</span>
              </div>
            ))}
          </div>
        </form>
      </div>

      {/* Login link */}
      <p className="text-center text-sm text-[var(--color-gray-400)] mt-6">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="text-[var(--color-primary)] font-semibold hover:underline no-underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
