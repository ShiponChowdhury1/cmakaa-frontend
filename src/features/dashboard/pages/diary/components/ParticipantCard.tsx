import type { DiaryParticipant } from '../types';

const ratingConfig: Record<string, { color: string; barColor: string }> = {
  Excellent: { color: '#16A34A', barColor: '#16A34A' },
  Good:      { color: '#E57432', barColor: '#E57432' },
  Fair:      { color: '#EA580C', barColor: '#EA580C' },
  Poor:      { color: '#DC2626', barColor: '#DC2626' },
};

function trustBg(trust: number) {
  if (trust >= 90) return '#F0FDF4';
  if (trust >= 80) return '#FFF7ED';
  if (trust >= 70) return '#FFFBEB';
  return '#FEF2F2';
}

function trustColor(trust: number) {
  if (trust >= 90) return '#16A34A';
  if (trust >= 80) return '#E57432';
  if (trust >= 70) return '#EA580C';
  return '#DC2626';
}

interface Props {
  participant: DiaryParticipant;
  onViewScore: (p: DiaryParticipant) => void;
}

export default function ParticipantCard({ participant: p, onViewScore }: Props) {
  const cfg = ratingConfig[p.rating] || ratingConfig.Fair;

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewScore(p)}
    >
      {/* Top row: avatar + name + trust badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#23334D] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {p.initials}
          </div>
          <div>
            <p className="text-base font-bold text-[var(--color-dark)] leading-tight">{p.name}</p>
            <p className="text-xs text-[#E57432] mt-0.5">{p.handle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Edit icon */}
          <button
            className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#E57432] hover:border-[#E57432] transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); }}
            title="Edit"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          {/* Trust badge */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
            style={{ background: trustBg(p.trust), color: trustColor(p.trust) }}
          >
            {p.trust}
          </div>
        </div>
      </div>

      {/* Rating label */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
        <span className="text-sm font-semibold" style={{ color: cfg.color }}>{p.rating}</span>
      </div>

      {/* Progress bar + percentage */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${p.overallPercent}%`, background: cfg.barColor }}
          />
        </div>
        <span className="text-sm font-bold text-[var(--color-dark)] w-10 text-right">{p.overallPercent}%</span>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-xs text-[#64748B] mb-3">
        <span>Pay {p.pay}%</span>
        <span>Time {p.time}%</span>
        <span>Post {p.post}%</span>
        <span>Commit {p.commit}%</span>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#64748B]">
          <span className="font-semibold text-[var(--color-dark)]">{p.activeCount} active</span>
          {' '}{p.completedCount} completed
        </p>
        <button
          className="text-xs font-semibold text-[#E57432] hover:text-[#c5612a] transition-colors bg-transparent border-none cursor-pointer"
          onClick={(e) => { e.stopPropagation(); }}
        >
          + Add to Pardna
        </button>
      </div>
    </div>
  );
}
