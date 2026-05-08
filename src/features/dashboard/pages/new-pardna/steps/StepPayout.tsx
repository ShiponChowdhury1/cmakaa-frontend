import type { NewPardnaFormData } from '../types';
import { DEMO_FORM } from '../types';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

export default function StepPayout({ data, onChange }: Props) {
  const contribution = Number(data.contributionAmount) || 0;
  const namedParticipants = data.participants.filter((p) => p.name.trim());
  const totalPot = contribution * data.participants.length;

  const handleDemo = () => {
    onChange({
      participants: DEMO_FORM.participants,
    });
  };

  const moveParticipant = (index: number, direction: 'up' | 'down') => {
    const arr = [...data.participants];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    onChange({ participants: arr });
  };

  const hasParticipants = namedParticipants.length > 0;

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
        <h2 className="text-base font-bold text-[var(--color-dark)]">Payout schedule</h2>
        <p className="text-xs text-[#64748B] mt-1">
          One payout per round. Use the arrows to set the order before continuing.
        </p>
      </div>

      {/* Payout order list */}
      {hasParticipants ? (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          {namedParticipants.map((p, i) => {
            const isFirst = i === 0;
            const isLast = i === namedParticipants.length - 1;
            const roundLabel = isFirst
              ? 'Pays out first'
              : isLast
                ? 'Final round'
                : 'Pays out next';

            return (
              <div
                key={p.id}
                className="flex items-center justify-between px-4 py-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: '#E57432' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-dark)]">
                      Round {i + 1} · {p.name}
                    </p>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      {roundLabel} · £{totalPot.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-md">
                    Position {i + 1}
                  </span>
                  {/* Reorder arrows */}
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveParticipant(i, 'up')}
                      disabled={isFirst}
                      className="text-[#94A3B8] hover:text-[#E57432] cursor-pointer bg-transparent border-none p-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 15l-6-6-6 6" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveParticipant(i, 'down')}
                      disabled={isLast}
                      className="text-[#94A3B8] hover:text-[#E57432] cursor-pointer bg-transparent border-none p-0 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl p-5 text-center border border-dashed border-gray-300" style={{ background: '#FAFAFA' }}>
          <p className="text-sm text-[#94A3B8]">
            Add at least one named participant on the previous step to set the payout order.
          </p>
        </div>
      )}

      {/* Example / Preview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#E57432] tracking-wider">Example</span>
          <span className="text-xs text-[#94A3B8]">Preview</span>
        </div>
        <p className="text-xs text-[#64748B] mb-3">
          Once you've added participants, drag them into the payout order — here's how it'll look.
        </p>

        {/* Example cards */}
        <div className="space-y-2">
          {[
            { round: 1, name: 'Sarah', label: 'Pays out first' },
            { round: 2, name: 'Marcus', label: 'Pays out next' },
            { round: 3, name: 'Aisha', label: 'Final round' },
          ].map((ex) => (
            <div
              key={ex.round}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl border"
              style={{ background: '#FAFAFA', borderColor: '#E5E7EB' }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#CBD5E1' }}
                >
                  {ex.round}
                </span>
                <div>
                  <p className="text-sm font-semibold text-[#94A3B8]">Round {ex.round} · {ex.name}</p>
                  <p className="text-xs text-[#CBD5E1] mt-0.5">{ex.label} · £600</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#CBD5E1] bg-[#F1F5F9] px-2 py-1 rounded-md">
                Position {ex.round}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#94A3B8] mt-2 italic text-center">Example only — not real data.</p>
      </div>
    </div>
  );
}
