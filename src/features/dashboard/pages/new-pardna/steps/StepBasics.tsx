import { useMemo } from 'react';
import type { NewPardnaFormData } from '../types';
import {
  Tag, FileText, Users, Calendar, Check,
  PoundSterling, Wallet, TrendingUp
} from 'lucide-react';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

const inputClass =
  'w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#C0C8D4] outline-none focus:border-[#E57432] focus:ring-4 focus:ring-[#E57432]/8 transition-all font-medium';

const frequencies: { label: string; value: NonNullable<NewPardnaFormData['frequency']>; icon: string; desc: string }[] = [
  { label: 'Daily', value: 'Daily', icon: '☀️', desc: 'Every single day' },
  { label: 'Weekly', value: 'Weekly', icon: '📅', desc: 'Every week' },
  { label: 'Fortnightly', value: 'Fortnightly', icon: '📆', desc: 'Every 2 weeks' },
  { label: 'Monthly', value: 'Monthly', icon: '🗓️', desc: 'Once a month' },
  { label: 'Quarterly', value: 'Quarterly', icon: '📊', desc: 'Every 3 months' },
  { label: 'Yearly', value: 'Yearly', icon: '🎯', desc: 'Once a year' },
];

export default function StepBasics({ data, onChange }: Props) {

  const numParticipants = Number(data.numberOfParticipants) || 0;
  const contribution = Number(data.contributionAmount) || 0;
  const totalPot = contribution * numParticipants;

  const completedFields = useMemo(() => {
    let count = 0;
    if (data.name.trim()) count++;
    if (data.contributionAmount) count++;
    if (data.numberOfParticipants) count++;
    if (data.startDate) count++;
    if (data.frequency) count++;
    return count;
  }, [data.name, data.contributionAmount, data.numberOfParticipants, data.startDate, data.frequency]);

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Section title + progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Basic Details
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">Set up the foundation for your savings group</p>
        </div>
        <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full transition-all"
                style={{ background: i < completedFields ? '#E57432' : '#E5E7EB' }}
              />
            ))}
          </div>
          <span className="text-[10px] font-bold text-[#E57432]">{completedFields}/5</span>
        </div>
      </div>

      {/* Pardna name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark)] mb-2.5">
          <Tag size={14} className="text-[#E57432]" />
          Pardna Name <span className="text-[#E57432]">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <Tag size={16} />
          </div>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Weekend Family Fund"
            className={inputClass}
          />
          {data.name.trim() && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Check size={16} className="text-emerald-500" strokeWidth={3} />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark)] mb-2.5">
          <FileText size={14} className="text-[#94A3B8]" />
          Description <span className="text-[#94A3B8] text-xs font-normal ml-1">(optional)</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-4.5 text-[#94A3B8]">
            <FileText size={16} />
          </div>
          <textarea
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="What's this pardna for? e.g. Monthly savings for summer trip"
            rows={3}
            className={`${inputClass} resize-none pt-4`}
          />
        </div>
      </div>

      {/* Contribution + Participants row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark)] mb-2.5">
            <PoundSterling size={14} className="text-[#E57432]" />
            Amount (£) <span className="text-[#E57432]">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 rounded-lg bg-[#E57432]/10 flex items-center justify-center">
                <span className="text-[#E57432] font-bold text-xs">£</span>
              </div>
            </div>
            <input
              type="number"
              value={data.contributionAmount}
              onChange={(e) => onChange({ contributionAmount: e.target.value })}
              placeholder="800"
              min={1}
              className={`${inputClass} pl-14`}
            />
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark)] mb-2.5">
            <Users size={14} className="text-[#E57432]" />
            Members <span className="text-[#E57432]">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Users size={16} />
            </div>
            <input
              type="number"
              value={data.numberOfParticipants}
              onChange={(e) => {
                const val = e.target.value;
                const num = Number(val) || 0;
                const currentArr = [...data.participants];
                let newArr = currentArr;
                if (num > currentArr.length) {
                  const maxId = Math.max(0, ...currentArr.map((p) => p.id));
                  for (let i = currentArr.length; i < num; i++) {
                    newArr = [...newArr, { id: maxId + i - currentArr.length + 1, name: '', email: '', phone: '' }];
                  }
                } else if (num < currentArr.length && num >= 1) {
                  newArr = currentArr.slice(0, num);
                }
                onChange({ numberOfParticipants: val, participants: newArr });
              }}
              placeholder="5"
              min={2}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Live pot preview */}
      {contribution > 0 && numParticipants > 0 && (
        <div
          className="rounded-2xl p-5 transition-all"
          style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Wallet size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Total Pot / Round</p>
                <p className="text-2xl font-bold text-white mt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                  £{totalPot.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-white/80">
                <TrendingUp size={12} />
                <span className="text-[10px] font-bold">PER ROUND</span>
              </div>
              <p className="text-xs text-white/90 mt-1 font-medium">£{contribution} × {numParticipants}</p>
            </div>
          </div>
        </div>
      )}

      {/* Start date */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark)] mb-2.5">
          <Calendar size={14} className="text-[#E57432]" />
          Start Date <span className="text-[#E57432]">*</span>
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
            <Calendar size={16} />
          </div>
          <input
            type="date"
            value={data.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Frequency picker */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--color-dark)] mb-1.5">
          <TrendingUp size={14} className="text-[#E57432]" />
          Frequency <span className="text-[#E57432]">*</span>
        </label>
        <p className="text-xs text-[#64748B] mb-4">How often will members contribute?</p>
        <div className="grid grid-cols-2 gap-3">
          {frequencies.map((f) => {
            const isSelected = data.frequency === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange({ frequency: f.value })}
                className="relative flex items-center gap-3.5 px-4 py-4 rounded-2xl text-sm cursor-pointer transition-all border text-left group"
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #FFF7ED, #FEF3C7)' : '#FFFFFF',
                  borderColor: isSelected ? '#E57432' : '#F1F5F9',
                  boxShadow: isSelected ? '0 4px 16px rgba(229,116,50,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <span className="text-2xl">{f.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--color-dark)] text-sm">{f.label}</p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">{f.desc}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#E57432] flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
