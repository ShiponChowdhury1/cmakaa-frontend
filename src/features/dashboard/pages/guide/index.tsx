import { useNavigate } from 'react-router-dom';
import { GUIDE_STEPS, GUIDE_TIPS } from './guideContent';

export default function GuidePage() {
  const navigate = useNavigate();

  return (
    <div className="w-full py-10 space-y-0">

      <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-4"
        style={{ fontFamily: 'var(--font-heading)' }}>
        What is a pardna?
      </h1>

      <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4">
        A pardna (also called a susu, partner hand, or ROSCA) is a simple group savings system.
        Everyone puts in the same amount on the same date, and in each round one person receives the
        full pot. It keeps going until everyone has had their turn.
      </p>

      <p className="text-sm text-[var(--color-text-muted)] mb-6">
        <span className="text-[var(--color-primary)] font-medium cursor-pointer hover:underline">
          PardnaBook doesn't move money.
        </span>{' '}
        It is your digital record book as the banker (organiser), so you can track payments clearly
        and everyone always knows their status.
      </p>

      {/* Before you start box */}
      <div className="border border-[#F0B28B] rounded-xl p-5 bg-orange-50/40 mb-10">
        <p className="text-sm font-semibold text-[var(--color-text)] mb-3">Before you start, agree on:</p>
        <ul className="space-y-1 text-sm text-[var(--color-text-muted)]">
          <li>How much each person pays per round</li>
          <li>How often you collect (weekly, fortnightly, or monthly)</li>
          <li>Who is joining the group</li>
          <li>The payout order (who gets paid first, second, and so on)</li>
          <li>What to do if someone misses a payment</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-[var(--color-text)] mb-6"
        style={{ fontFamily: 'var(--font-heading)' }}>
        The 5 easy steps
      </h2>

      <div className="space-y-8 mb-12">

        {GUIDE_STEPS.map((step) => (
          <div key={step.num} className="flex gap-4">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm">
              {step.num}
            </div>
            <div>
              <p className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest mb-0.5">
                {step.label}
              </p>
              <h3 className="text-base font-bold text-[var(--color-text)] mb-1">{step.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}

      </div>

      {/* Tips box */}
      <div className="border border-[#F0B28B] rounded-xl p-5 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[var(--color-primary)]">↓</span>
          <p className="text-sm font-semibold text-[var(--color-text)]">Helpful tips from experienced bankers</p>
        </div>
        <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
          {GUIDE_TIPS.map((tip, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--color-primary)] mt-0.5 flex-shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/dashboard/pardnas/new')}
          className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all cursor-pointer"
          style={{ background: 'var(--color-primary)' }}
        >
          + Start your first pardna
        </button>
      </div>

    </div>
  );
}