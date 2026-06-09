import type { NewPardnaFormData } from '../types';
import { BookOpen } from 'lucide-react';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

export default function StepRules({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section title */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Rules & Structure
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">Define how your pardna operates</p>
      </div>

      {/* Notes / Rules */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark)] mb-1.5">
          <BookOpen size={14} className="text-[#E57432]" />
          Pardna Rules & Notes
        </label>
        <p className="text-xs text-[#64748B] mb-3">Write house rules so everyone's on the same page</p>
        <div className="relative">
          <div className="absolute left-4 top-4 text-[#94A3B8]">
            <BookOpen size={16} />
          </div>
          <textarea
            value={data.rulesNotes}
            onChange={(e) => onChange({ rulesNotes: e.target.value })}
            placeholder="e.g. Everyone contributes every Friday. Payout rotates weekly. 48h grace period for late payments."
            rows={8}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#C0C8D4] outline-none focus:border-[#E57432] focus:ring-4 focus:ring-[#E57432]/8 transition-all resize-none font-medium"
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-[#94A3B8]">Be specific to avoid disputes later</p>
          <p className="text-[10px] text-[#94A3B8] font-mono">{data.rulesNotes.length} chars</p>
        </div>
      </div>
    </div>
  );
}
