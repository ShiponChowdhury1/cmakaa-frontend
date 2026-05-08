import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function CheckInboxPage() {
  const location = useLocation();
  const { method, value } = (location.state as { method?: string; value?: string }) || {};
  const [, setResent] = useState(false);

  const handleTryDifferent = () => {
    window.history.back();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h1
          className="text-2xl sm:text-3xl font-bold text-[var(--color-dark)] mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Check your inbox
        </h1>
        <p className="text-[var(--color-gray-500)] text-sm max-w-sm mx-auto">
          If an account exists for that {method === 'sms' ? 'number' : 'email'}, we've sent an {method === 'sms' ? 'SMS' : 'email'} with a code to reset your password.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-lg)] border border-gray-100 space-y-5">
        {/* Success Alert */}
        <div className="flex items-start gap-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-4">
          <CheckCircle2 size={20} className="text-[var(--color-success)] shrink-0 mt-0.5" />
          <p className="text-sm text-[#065F46]">
            Reset code sent to <span className="font-semibold">{value}</span>. The code expires in 10 minutes.
          </p>
        </div>

        {/* Try different email */}
        <button
          type="button"
          onClick={handleTryDifferent}
          className="w-full px-6 py-3.5 text-sm font-semibold text-[var(--color-dark)] bg-white border border-[var(--color-gray-200)] rounded-xl hover:bg-[var(--color-gray-100)] hover:border-[var(--color-gray-300)] transition-all cursor-pointer"
        >
          Try a different {method === 'sms' ? 'number' : 'email'}
        </button>
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
