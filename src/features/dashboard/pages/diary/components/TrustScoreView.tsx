import type { DiaryParticipant } from '../types';

const ratingConfig: Record<string, { color: string; label: string }> = {
  Excellent: { color: '#16A34A', label: 'Excellent' },
  Good:      { color: '#E57432', label: 'Good' },
  Fair:      { color: '#EA580C', label: 'Fair' },
  Poor:      { color: '#DC2626', label: 'Poor' },
};

const barItems: { key: keyof DiaryParticipant['behavioural']; label: string; color: string }[] = [
  { key: 'paymentConsistency',    label: 'Payment Consistency',    color: '#E57432' },
  { key: 'timeliness',            label: 'Timeliness',             color: '#EA580C' },
  { key: 'postPayoutBehaviour',   label: 'Post-Payout Behaviour',  color: '#F97316' },
  { key: 'commitment',            label: 'Commitment',             color: '#16A34A' },
  { key: 'completionRate',        label: 'Completion Rate',        color: '#E57432' },
  { key: 'groupStability',        label: 'Group Stability',        color: '#EA580C' },
  { key: 'trendDirection',        label: 'Trend Direction',        color: '#E57432' },
];

function eventIcon(type: string) {
  switch (type) {
    case 'missed':
      return (
        <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center shrink-0 bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
          </svg>
        </div>
      );
    case 'paid':
      return (
        <div className="w-10 h-10 rounded-full border-2 border-green-400 flex items-center justify-center shrink-0 bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      );
    case 'payout':
      return (
        <div className="w-10 h-10 rounded-full border-2 border-green-400 flex items-center justify-center shrink-0 bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
          </svg>
        </div>
      );
    case 'joined':
    default:
      return (
        <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0 bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" />
          </svg>
        </div>
      );
  }
}

interface Props {
  participant: DiaryParticipant;
  participants: DiaryParticipant[];
  onBack: () => void;
  onSelectParticipant: (p: DiaryParticipant) => void;
}

export default function TrustScoreView({ participant, participants, onBack, onSelectParticipant }: Props) {
  const cfg = ratingConfig[participant.rating] || ratingConfig.Fair;

  return (
    <div className="space-y-5 animate-fade-in pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
              Trust Score & History
            </h1>
            <p className="text-xs text-[#E57432]">Participant Score Sheet</p>
          </div>
        </div>
      </div>

      {/* Participant selector */}
      <div className="relative">
        <select
          value={participant.id}
          onChange={(e) => {
            const found = participants.find((p) => p.id === Number(e.target.value));
            if (found) onSelectParticipant(found);
          }}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-white text-base font-medium appearance-none text-[var(--color-dark)] cursor-pointer"
        >
          {participants.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">✕</span>
      </div>

      {/* Composite Behavioural Rating */}
      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-[var(--color-dark)] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Composite Behavioural Rating
        </h2>

        {/* Rating + Percentage */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2" style={{ borderColor: cfg.color }} />
            <span className="text-sm font-semibold" style={{ color: cfg.color }}>{cfg.label}</span>
          </div>
          <span className="text-3xl font-bold" style={{ color: cfg.color, fontFamily: 'var(--font-heading)' }}>
            {participant.overallPercent}%
          </span>
        </div>

        {/* Breakdown Bars */}
        <div className="space-y-3">
          {barItems.map((item) => {
            const value = participant.behavioural[item.key];
            return (
              <div key={item.key} className="flex items-center gap-3">
                <span className="text-xs text-[#64748B] w-40 shrink-0">{item.label}</span>
                <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${value}%`, background: item.color }}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--color-dark)] w-10 text-right">{value}%</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Behavioural Timeline */}
      <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-base font-bold text-[var(--color-dark)] mb-5" style={{ fontFamily: 'var(--font-heading)' }}>
          Behavioural Timeline
        </h2>

        <div className="space-y-0">
          {participant.timeline.map((evt, i) => (
            <div key={evt.id} className="flex gap-3">
              {/* Icon + line */}
              <div className="flex flex-col items-center">
                {eventIcon(evt.type)}
                {i < participant.timeline.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 min-h-[24px]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-dark)] leading-tight">{evt.title}</p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {evt.tags.map((tag, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold"
                          style={{ color: tag.color, background: tag.bg }}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-[#94A3B8] mt-1">{evt.date}</p>
                  </div>

                  {/* Trust change */}
                  <div className="text-right shrink-0 ml-3">
                    <p className={`text-xs font-semibold ${evt.trustChange > 0 ? 'text-green-600' : evt.trustChange < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                      {evt.trustChange > 0 ? `↗ +${evt.trustChange}` : evt.trustChange < 0 ? `↘ ${evt.trustChange}` : '→ 0'}
                    </p>
                    <p className="text-[10px] text-[#94A3B8]">{evt.trustScores}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
