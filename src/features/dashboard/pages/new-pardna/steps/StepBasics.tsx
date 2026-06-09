import { useMemo, useState } from 'react';
import type { NewPardnaFormData } from '../types';
import {
  Tag, FileText, Users, Calendar, Check,
  PoundSterling, Wallet, TrendingUp,
  Sun, CalendarRange, CalendarDays, BarChart3, Target,
  ChevronDown,
  type LucideIcon
} from 'lucide-react';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

const inputWrapperClass =
  'flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#E57432] focus-within:ring-4 focus-within:ring-[#E57432]/8 transition-all shadow-sm';

const innerInputClass =
  'flex-1 text-sm font-medium text-[var(--color-dark)] bg-transparent border-none outline-none placeholder:text-[#94A3B8] p-0';

const frequencies: { label: string; value: NonNullable<NewPardnaFormData['frequency']>; icon: LucideIcon; desc: string }[] = [
  { label: 'Daily', value: 'Daily', icon: Sun, desc: 'Every single day' },
  { label: 'Weekly', value: 'Weekly', icon: Calendar, desc: 'Every week' },
  { label: 'Fortnightly', value: 'Fortnightly', icon: CalendarRange, desc: 'Every 2 weeks' },
  { label: 'Monthly', value: 'Monthly', icon: CalendarDays, desc: 'Once a month' },
  { label: 'Quarterly', value: 'Quarterly', icon: BarChart3, desc: 'Every 3 months' },
  { label: 'Yearly', value: 'Yearly', icon: Target, desc: 'Once a year' },
];

export default function StepBasics({ data, onChange }: Props) {
  const [freqDropdownOpen, setFreqDropdownOpen] = useState(false);

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
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Pardna Name <span className="text-[#E57432]">*</span>
        </label>
        <div className={inputWrapperClass}>
          <Tag size={16} className="text-[#94A3B8] shrink-0" />
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Weekend Family Fund"
            className={innerInputClass}
          />
          {data.name.trim() && (
            <Check size={16} className="text-emerald-500 shrink-0" strokeWidth={3} />
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Description <span className="text-gray-400 font-normal lowercase ml-1">(optional)</span>
        </label>
        <div className="flex gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#E57432] focus-within:ring-4 focus-within:ring-[#E57432]/8 transition-all shadow-sm">
          <FileText size={16} className="text-[#94A3B8] shrink-0 mt-1" />
          <textarea
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="What's this pardna for? e.g. Monthly savings for summer trip"
            rows={3}
            className="flex-1 text-sm font-medium text-[var(--color-dark)] bg-transparent border-none outline-none placeholder:text-[#94A3B8] p-0 resize-none"
          />
        </div>
      </div>

      {/* Parameters Row: Amount, Members, Start Date, Frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Amount */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Amount (£) <span className="text-[#E57432]">*</span>
          </label>
          <div className={inputWrapperClass}>
            <div className="w-6 h-6 rounded-lg bg-[#E57432]/10 flex items-center justify-center shrink-0">
              <span className="text-[#E57432] font-bold text-xs">£</span>
            </div>
            <input
              type="number"
              value={data.contributionAmount}
              onChange={(e) => onChange({ contributionAmount: e.target.value })}
              placeholder="800"
              min={1}
              className={`${innerInputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
          </div>
        </div>

        {/* Members */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Members <span className="text-[#E57432]">*</span>
          </label>
          <div className={inputWrapperClass}>
            <Users size={16} className="text-[#94A3B8] shrink-0" />
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
              className={`${innerInputClass} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Start Date <span className="text-[#E57432]">*</span>
          </label>
          <div className={inputWrapperClass}>
            <Calendar size={16} className="text-[#94A3B8] shrink-0" />
            <input
              type="date"
              value={data.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className={innerInputClass}
            />
          </div>
        </div>

        {/* Frequency */}
        <div className="relative">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            Frequency <span className="text-[#E57432]">*</span>
          </label>
          
          {/* Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setFreqDropdownOpen(!freqDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white hover:border-[#E57432] focus:outline-none transition-all shadow-sm text-left cursor-pointer h-[46px]"
          >
            {(() => {
              const selected = frequencies.find((f) => f.value === data.frequency) || frequencies[1]; // default to Weekly
              const SelectedIcon = selected.icon;
              return (
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-[#E57432]/10 text-[#E57432] flex items-center justify-center shrink-0">
                    <SelectedIcon size={14} />
                  </span>
                  <span className="text-sm font-semibold text-[var(--color-dark)] truncate">{selected.label}</span>
                </div>
              );
            })()}
            <ChevronDown size={16} className="text-[#94A3B8] transition-transform duration-200 shrink-0" style={{ transform: freqDropdownOpen ? 'rotate(180deg)' : 'none' }} />
          </button>

          {/* Dropdown Options */}
          {freqDropdownOpen && (
            <>
              {/* Backdrop to close dropdown */}
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setFreqDropdownOpen(false)} />
              
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden py-1.5 max-h-72 overflow-y-auto animate-fade-in-down">
                {frequencies.map((f) => {
                  const IconComp = f.icon;
                  const isSelected = data.frequency === f.value;
                  return (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => {
                        onChange({ frequency: f.value });
                        setFreqDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 hover:bg-orange-50/60 cursor-pointer bg-transparent border-none transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#E57432] text-white' : 'bg-gray-50 text-gray-400'}`}>
                          <IconComp size={13} />
                        </span>
                        <span className={`text-sm font-bold ${isSelected ? 'text-[#E57432]' : 'text-[var(--color-dark)]'}`}>{f.label}</span>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-[#E57432]" strokeWidth={3} />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
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
    </div>
  );
}
