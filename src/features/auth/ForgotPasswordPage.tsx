import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, MessageSquare } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useForgotPasswordMutation } from '@/store/features/auth/authApi';

type Method = 'email' | 'sms';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [forgotPassword] = useForgotPasswordMutation();

  const [method, setMethod] = useState<Method>('email');
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!value.trim()) {
      setError(method === 'email' ? 'Email is required' : 'Phone number is required');
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword({ email: value }).unwrap();

      if (result.success) {
        // OTP sent → navigate to OTP verification for password reset
        navigate('/auth/verify-otp', {
          state: { email: value, flow: 'forgot-password' },
        });
      }
    } catch (err: any) {
      const msg = err?.data?.message || 'Failed to send reset code. Please try again.';
      setError(msg);
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
          Forgot your password?
        </h1>
        <p className="text-[var(--color-gray-500)] text-sm">
          Choose how you'd like to receive your reset instructions.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-lg)] border border-gray-100">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Method Toggle */}
          <div className="grid grid-cols-2 gap-0 bg-[var(--color-gray-100)] rounded-xl p-1">
            <button
              type="button"
              onClick={() => { setMethod('email'); setValue(''); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border-none ${
                method === 'email'
                  ? 'bg-white text-[var(--color-primary)] shadow-sm'
                  : 'bg-transparent text-[var(--color-gray-500)] hover:text-[var(--color-dark)]'
              }`}
            >
              <Mail size={16} />
              Email
            </button>
            <button
              type="button"
              onClick={() => { setMethod('sms'); setValue(''); setError(''); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border-none ${
                method === 'sms'
                  ? 'bg-white text-[var(--color-primary)] shadow-sm'
                  : 'bg-transparent text-[var(--color-gray-500)] hover:text-[var(--color-dark)]'
              }`}
            >
              <MessageSquare size={16} />
              SMS
            </button>
          </div>

          {/* Input */}
          <div>
            <label
              htmlFor="forgot-input"
              className="block text-sm font-semibold text-[var(--color-dark)] mb-2"
            >
              {method === 'email' ? 'Email' : 'Phone number'}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-gray-400)]">
                {method === 'email' ? <Mail size={16} /> : <MessageSquare size={16} />}
              </div>
              <input
                id="forgot-input"
                type={method === 'email' ? 'email' : 'tel'}
                placeholder={method === 'email' ? 'you@example.com' : '+44 7700 900000'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`${inputClass} pl-11 ${error ? 'border-[var(--color-error)]' : ''}`}
              />
            </div>
            {error && (
              <p className="mt-2 text-xs text-[var(--color-error)]">{error}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isLoading}
            className="rounded-xl"
          >
            Send reset link
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
