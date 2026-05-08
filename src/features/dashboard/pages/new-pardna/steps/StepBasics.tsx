import type { NewPardnaFormData } from '../types';
import { DEMO_FORM } from '../types';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors';

const frequencies: { label: string; value: NewPardnaFormData['frequency']; tag: string; desc: string }[] = [
  { label: 'Weekly · Fridays', value: 'Weekly', tag: 'Weekly', desc: '12 rounds · ends 22 Aug' },
  { label: 'Fortnightly', value: 'Fortnightly', tag: '2-weekly', desc: '8 rounds · ends 12 Oct' },
  { label: 'Monthly', value: 'Monthly', tag: 'Monthly', desc: '10 rounds · ends 30 Mar' },
];

export default function StepBasics({ data, onChange }: Props) {
  const handleDemo = () => {
    onChange({ ...DEMO_FORM });
  };

  const numParticipants = Number(data.numberOfParticipants) || 0;

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

      {/* Pardna name */}
      <div>
        <label className="block text-sm font-bold text-[var(--color-dark)] mb-1.5">Pardna name</label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="e.g. Family Monthly"
          className={inputClass}
        />
      </div>

      {/* Description (optional) */}
      <div>
        <label className="block text-sm font-bold text-[var(--color-dark)] mb-1.5">Description (optional)</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="What's this pardna for?"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Contribution amount (£) */}
      <div>
        <label className="block text-sm font-bold text-[var(--color-dark)] mb-1.5">Contribution amount (£)</label>
        <input
          type="number"
          value={data.contributionAmount}
          onChange={(e) => onChange({ contributionAmount: e.target.value })}
          placeholder="200"
          min={1}
          className={inputClass}
        />
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-bold text-[var(--color-dark)] mb-1.5">Frequency</label>
        <div className="relative">
          <select
            value={data.frequency}
            onChange={(e) => onChange({ frequency: e.target.value as NewPardnaFormData['frequency'] })}
            className={`${inputClass} appearance-none cursor-pointer`}
            style={{ color: data.frequency ? 'var(--color-dark)' : '#94A3B8' }}
          >
            <option value="" disabled>Choose frequency</option>
            <option value="Weekly">Weekly</option>
            <option value="Fortnightly">Fortnightly</option>
            <option value="Monthly">Monthly</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>

      {/* Start date */}
      <div>
        <label className="block text-sm font-bold text-[var(--color-dark)] mb-1.5">Start date</label>
        <input
          type="date"
          value={data.startDate}
          onChange={(e) => onChange({ startDate: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* Number of participants */}
      <div>
        <label className="block text-sm font-bold text-[var(--color-dark)] mb-1.5">Number of participants</label>
        <input
          type="number"
          value={data.numberOfParticipants}
          onChange={(e) => {
            const val = e.target.value;
            const num = Number(val) || 0;
            // Auto-adjust participants array
            const currentArr = [...data.participants];
            let newArr = currentArr;
            if (num > currentArr.length) {
              const maxId = Math.max(0, ...currentArr.map((p) => p.id));
              for (let i = currentArr.length; i < num; i++) {
                newArr = [...newArr, { id: maxId + i - currentArr.length + 1, name: '', phone: '' }];
              }
            } else if (num < currentArr.length && num >= 1) {
              newArr = currentArr.slice(0, num);
            }
            onChange({ numberOfParticipants: val, participants: newArr });
          }}
          placeholder="3"
          min={2}
          className={inputClass}
        />
        <p className="text-xs text-[#64748B] mt-1">
          {numParticipants > 0 ? `${numParticipants} participants` : '—'}. One payout round per participant.
        </p>
      </div>

      {/* Example / Preview — frequency cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#E57432] tracking-wider">Example</span>
          <span className="text-xs text-[#94A3B8]">Preview</span>
        </div>
        <p className="text-xs text-[#64748B] mb-3">
          Choose how often the pardna runs — the schedule fills in automatically.
        </p>
        <div className="space-y-2">
          {frequencies.map((f) => {
            const isSelected = data.frequency === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange({ frequency: f.value })}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm cursor-pointer transition-all border"
                style={{
                  background: isSelected ? '#FFF7ED' : '#FFFFFF',
                  borderColor: isSelected ? '#E57432' : '#E5E7EB',
                }}
              >
                <div className="text-left">
                  <p className="font-semibold text-[var(--color-dark)]">{f.label}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{f.desc}</p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: isSelected ? '#E57432' : '#F1F5F9',
                    color: isSelected ? 'white' : '#64748B',
                  }}
                >
                  {f.tag}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
