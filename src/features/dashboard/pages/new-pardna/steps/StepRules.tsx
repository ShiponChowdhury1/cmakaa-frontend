import type { NewPardnaFormData } from '../types';
import { DEMO_FORM } from '../types';
import {
  Zap, ChevronRight, Check, BookOpen, PlusCircle, Lightbulb,
  ListOrdered, Shuffle as ShuffleIcon
} from 'lucide-react';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

const payoutOptions: { value: NonNullable<NewPardnaFormData['payoutOrder']>; label: string; desc: string; icon: string }[] = [
  { value: 'Fixed order', label: 'Fixed Order', desc: 'Banker assigns each round\'s recipient', icon: '📋' },
  { value: 'Random draw', label: 'Random Draw', desc: 'Positions decided by fair lottery', icon: '🎲' },
];

export default function StepRules({ data, onChange }: Props) {
  const handleDemo = () => {
    onChange({
      payoutOrder: DEMO_FORM.payoutOrder,
      rulesNotes: DEMO_FORM.rulesNotes,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Demo auto-fill */}
      <button
        type="button"
        onClick={handleDemo}
        className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-medium cursor-pointer transition-all hover:shadow-md active:scale-[0.98] border-none"
        style={{ background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)', color: '#B45309' }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E57432, #F4A261)' }}>
          <Zap size={16} className="text-white" />
        </div>
        <div className="text-left flex-1">
          <p className="font-bold text-[#E57432] text-sm">Quick demo</p>
          <p className="text-[11px] text-[#B45309] mt-0.5">Auto-fill rules with examples</p>
        </div>
        <ChevronRight size={16} className="text-[#E57432]" />
      </button>

      {/* Section title */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Rules & Structure
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">Define how your pardna operates</p>
      </div>

      {/* Payout order selection */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark)] mb-1.5">
          <ListOrdered size={14} className="text-[#E57432]" />
          Payout Structure <span className="text-[#E57432]">*</span>
        </label>
        <p className="text-xs text-[#64748B] mb-4">How will payout order be determined?</p>
        <div className="space-y-3">
          {payoutOptions.map((opt) => {
            const isSelected = data.payoutOrder === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange({ payoutOrder: opt.value })}
                className="w-full flex items-center gap-4 px-5 py-5 rounded-2xl text-sm cursor-pointer transition-all border-2 text-left"
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #FFF7ED, #FEF3C7)' : '#FFFFFF',
                  borderColor: isSelected ? '#E57432' : '#F1F5F9',
                  boxShadow: isSelected ? '0 4px 16px rgba(229,116,50,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                <span className="text-3xl">{opt.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-[var(--color-dark)] text-base">{opt.label}</p>
                  <p className="text-xs text-[#64748B] mt-1">{opt.desc}</p>
                </div>
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    borderColor: isSelected ? '#E57432' : '#D1D5DB',
                    background: isSelected ? '#E57432' : 'transparent',
                  }}
                >
                  {isSelected && (
                    <Check size={14} className="text-white" strokeWidth={3} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
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
            rows={5}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#C0C8D4] outline-none focus:border-[#E57432] focus:ring-4 focus:ring-[#E57432]/8 transition-all resize-none font-medium"
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-[#94A3B8]">Be specific to avoid disputes later</p>
          <p className="text-[10px] text-[#94A3B8] font-mono">{data.rulesNotes.length} chars</p>
        </div>
      </div>

      {/* Suggested rules */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={14} className="text-amber-500" />
          <p className="text-xs font-bold text-[#64748B]">Suggested rules</p>
        </div>
        <div className="space-y-2">
          {[
            '48h grace period for late payments',
            'Payout on the last Friday of each round',
            'Banker covers any shortfalls',
            'Members must notify 24h in advance for delays',
          ].map((rule) => {
            const isAdded = data.rulesNotes.includes(rule);
            return (
              <button
                key={rule}
                type="button"
                disabled={isAdded}
                onClick={() => {
                  const current = data.rulesNotes.trim();
                  const newVal = current ? `${current}\n• ${rule}` : `• ${rule}`;
                  onChange({ rulesNotes: newVal });
                }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-xs cursor-pointer bg-white border-2 transition-all disabled:opacity-50 disabled:cursor-default"
                style={{
                  borderColor: isAdded ? '#10B981' : '#F1F5F9',
                  color: isAdded ? '#10B981' : '#64748B',
                  background: isAdded ? '#F0FDF4' : '#FFFFFF',
                }}
              >
                {isAdded ? (
                  <Check size={14} className="text-emerald-500 shrink-0" strokeWidth={3} />
                ) : (
                  <PlusCircle size={14} className="text-[#94A3B8] shrink-0" />
                )}
                <span className="font-medium">{rule}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
