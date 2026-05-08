import type { NewPardnaFormData } from '../types';
import { DEMO_FORM } from '../types';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors';

const payoutOptions: { value: NewPardnaFormData['payoutOrder']; label: string; desc: string; tag: string }[] = [
  { value: 'Fixed order', label: 'Fixed order', desc: 'Banker assigns each round', tag: 'Structure' },
  { value: 'Random draw', label: 'Random draw', desc: 'Positions decided by lottery', tag: 'Fair' },
];

export default function StepRules({ data, onChange }: Props) {
  const handleDemo = () => {
    onChange({
      payoutOrder: DEMO_FORM.payoutOrder,
      rulesNotes: DEMO_FORM.rulesNotes,
    });
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

      {/* Payout order */}
      <div>
        <label className="block text-sm font-bold text-[var(--color-dark)] mb-1.5">Payout order</label>
        <div className="relative">
          <select
            value={data.payoutOrder}
            onChange={(e) => onChange({ payoutOrder: e.target.value as NewPardnaFormData['payoutOrder'] })}
            className={`${inputClass} appearance-none cursor-pointer`}
            style={{ color: data.payoutOrder ? 'var(--color-dark)' : '#94A3B8' }}
          >
            <option value="" disabled>Choose payout structure</option>
            <option value="Fixed order">Fixed order</option>
            <option value="Random draw">Random draw</option>
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </div>
      </div>

      {/* Pardna rules / notes */}
      <div>
        <label className="block text-sm font-bold text-[var(--color-dark)] mb-1.5">Pardna rules / notes</label>
        <textarea
          value={data.rulesNotes}
          onChange={(e) => onChange({ rulesNotes: e.target.value })}
          placeholder="Late payment policy, payout conditions, etc."
          rows={4}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Example / Preview */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-[#E57432] tracking-wider">Example</span>
          <span className="text-xs text-[#94A3B8]">Preview</span>
        </div>
        <p className="text-xs text-[#64748B] mb-3">
          Pick a payout structure and jot down house rules so everyone's on the same page.
        </p>
        <div className="space-y-2">
          {payoutOptions.map((opt) => {
            const isSelected = data.payoutOrder === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ payoutOrder: opt.value })}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm cursor-pointer transition-all border"
                style={{
                  background: isSelected ? '#FFF7ED' : '#FFFFFF',
                  borderColor: isSelected ? '#E57432' : '#E5E7EB',
                }}
              >
                <div className="text-left">
                  <p className="font-semibold text-[var(--color-dark)]">{opt.label}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{opt.desc}</p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-lg"
                  style={{
                    background: isSelected ? '#E57432' : '#F1F5F9',
                    color: isSelected ? 'white' : '#64748B',
                  }}
                >
                  {opt.tag}
                </span>
              </button>
            );
          })}

          {/* Late policy example */}
          <div
            className="flex items-center justify-between px-4 py-3.5 rounded-xl text-sm border"
            style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
          >
            <div className="text-left">
              <p className="font-semibold text-[var(--color-dark)]">Late policy</p>
              <p className="text-xs text-[#64748B] mt-0.5">e.g. 48h grace, then late mark</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: '#F1F5F9', color: '#64748B' }}>
              Rule
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
