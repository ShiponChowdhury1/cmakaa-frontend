import type { NewPardnaFormData } from '../types';
import { DEMO_FORM } from '../types';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

export default function StepSummary({ data, onChange }: Props) {
  const numParticipants = data.participants.filter((p) => p.name.trim()).length || Number(data.numberOfParticipants) || 0;
  const contribution = Number(data.contributionAmount) || 0;
  const totalPot = contribution * numParticipants;

  const handleDemo = () => {
    onChange({ ...DEMO_FORM });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Demo version button */}
      <button
        type="button"
        onClick={handleDemo}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all hover:shadow-sm"
        style={{ background: '#FFF7ED', border: '1px solid #FDDCB5', color: '#E57432' }}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          <span className="font-semibold">Demo version</span>
        </div>
        <span className="text-xs text-[#B45309]">Autofill every field with example details.</span>
      </button>

      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Summary
        </h2>
        <p className="text-xs text-[#64748B] mt-1">
          Review everything before creating. You can still go back to edit any step.
        </p>
      </div>

      {/* Summary card */}
      <section className="border border-gray-200 rounded-2xl p-5 space-y-4">
        {/* Pardna name */}
        <h3 className="text-base font-bold text-[var(--color-dark)]">{data.name || 'Untitled pardna'}</h3>

        {/* Total pot per round */}
        <div className="rounded-xl p-4" style={{ background: '#FFF7ED' }}>
          <p className="text-[10px] font-bold tracking-wider text-[#E57432] mb-1">Total pot per round</p>
          <p className="text-3xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            £{totalPot.toLocaleString()}
          </p>
          <p className="text-xs text-[#64748B] mt-0.5">
            £{contribution} × {numParticipants} participants
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
          <div className="flex items-center gap-2">
            <span className="text-[#E57432]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#64748B]">CONTRIBUTION</p>
              <p className="text-base font-bold text-[var(--color-dark)]">£{contribution || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E57432]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#64748B]">FREQUENCY</p>
              <p className="text-base font-bold text-[var(--color-dark)]">{data.frequency || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E57432]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#64748B]">PARTICIPANTS</p>
              <p className="text-base font-bold text-[var(--color-dark)]">{numParticipants}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#E57432]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-bold tracking-wider text-[#64748B]">STARTS</p>
              <p className="text-base font-bold text-[var(--color-dark)]">
                {data.startDate
                  ? new Date(data.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: '2-digit' })
                  : 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info note */}
      <div className="flex items-start gap-2 rounded-2xl p-4" style={{ background: '#FFF7ED', border: '1px solid #FDDCB5' }}>
        <span className="text-[#E57432] shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
          </svg>
        </span>
        <p className="text-xs text-[#64748B] leading-relaxed">
          Once you confirm, the pardna and its payout rounds are created. You can still edit details from the pardna overview.
        </p>
      </div>
    </div>
  );
}
