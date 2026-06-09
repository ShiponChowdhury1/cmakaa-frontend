import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STEP_LABELS, INITIAL_FORM } from './types';
import type { NewPardnaFormData, StepIndex } from './types';
import StepBasics from './steps/StepBasics';
import StepRules from './steps/StepRules';
import StepParticipants from './steps/StepParticipants';
import StepPayout from './steps/StepPayout';
import StepSummary from './steps/StepReview';
import StepDone from './steps/StepDone';
import { useCreatePardnaMutation } from '@/store/features/createPardna/createPardna.api';
import { toast } from 'react-toastify';
import { Landmark, ShieldAlert, Users, ArrowRightLeft, FileCheck, CheckCircle2, ChevronLeft, Check } from 'lucide-react';

const STEP_ICONS = [
  /* Basics */    <Landmark key="b" size={14} />,
  /* Rules */     <ShieldAlert key="r" size={14} />,
  /* People */    <Users key="p" size={14} />,
  /* Payout */    <ArrowRightLeft key="o" size={14} />,
  /* Summary */   <FileCheck key="s" size={14} />,
  /* Done */      <CheckCircle2 key="d" size={14} />,
];

export default function NewPardnaPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<NewPardnaFormData>({ ...INITIAL_FORM });
  const [createPardna, { isLoading }] = useCreatePardnaMutation();

  const update = (partial: Partial<NewPardnaFormData>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const next = () => setStep((s) => Math.min(s + 1, 5) as StepIndex);
  const back = () => setStep((s) => Math.max(s - 1, 0) as StepIndex);

  const handleCreate = async () => {
    try {
      const payload = {
        name: form.name,
        description: form.description,
        notes: form.rulesNotes,
        contribution: Number(form.contributionAmount),
        frequency: form.frequency.toUpperCase() as any,
        startDate: form.startDate,
        totalRounds: form.participants.length,
        participants: form.participants.map((p, idx) => ({
          fullName: p.name,
          email: p.email,
          phoneNumber: p.phone,
          payoutOrder: idx + 1,
        })),
      };
      await createPardna(payload).unwrap();
      toast.success('🎉 Pardna created successfully!');
      next();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to create Pardna. Please try again.');
    }
  };

  const isDone = step === 5;
  const isSummary = step === 4;

  return (
    <div className="animate-fade-in pb-28">
      {/* ── Elegant Header ── */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => (step === 0 ? navigate('/dashboard') : back())}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
        >
          <ChevronLeft size={16} strokeWidth={2.5} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Create Pardna
          </h1>
          <p className="text-[11px] text-[#94A3B8]">Step {step + 1} of {STEP_LABELS.length}</p>
        </div>
      </div>

      {/* ── Premium Stepper ── */}
      {!isDone && (
        <div className="flex items-center gap-1 mb-7">
          {STEP_LABELS.map((label, i) => {
            const isActive = i === step;
            const isPast = i < step;
            return (
              <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
                {/* Icon circle */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #E57432, #F4A261)'
                      : isPast
                      ? '#E57432'
                      : '#F1F5F9',
                    color: isActive || isPast ? 'white' : '#94A3B8',
                    boxShadow: isActive ? '0 4px 12px rgba(229,116,50,0.35)' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {isPast ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    STEP_ICONS[i]
                  )}
                </div>
                {/* Label */}
                <span
                  className="text-[10px] font-semibold transition-colors text-center leading-tight"
                  style={{
                    color: isActive ? '#E57432' : isPast ? '#E57432' : '#94A3B8',
                  }}
                >
                  {label}
                </span>
                {/* Progress bar under */}
                <div
                  className="w-full h-[3px] rounded-full transition-all duration-500"
                  style={{
                    background: isActive || isPast ? '#E57432' : '#E5E7EB',
                    opacity: isPast ? 0.5 : 1,
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Step Content ── */}
      <div className="mb-6">
        {step === 0 && <StepBasics data={form} onChange={update} />}
        {step === 1 && <StepRules data={form} onChange={update} />}
        {step === 2 && <StepParticipants data={form} onChange={update} />}
        {step === 3 && <StepPayout data={form} onChange={update} />}
        {step === 4 && <StepSummary data={form} onChange={update} />}
        {step === 5 && (
          <StepDone
            data={form}
            onGoHome={() => navigate('/dashboard')}
          />
        )}
      </div>

      {/* ── Bottom Navigation ── */}
      {!isDone && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 p-4 z-50">
          <div className="max-w-xl mx-auto grid grid-cols-2 gap-3">
            <button
              onClick={() => (step === 0 ? navigate('/dashboard') : back())}
              className="py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:bg-orange-50 active:scale-[0.98]"
              style={{ background: '#FFFFFF', color: '#E57432', border: '1px solid #E57432' }}
            >
              ← Back
            </button>

            {isSummary ? (
              <button
                onClick={handleCreate}
                disabled={isLoading}
                className="py-3.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none transition-all hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)' }}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Creating...
                  </>
                ) : (
                  '✓ Create & Confirm'
                )}
              </button>
            ) : (
              <button
                onClick={next}
                className="py-3.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none transition-all hover:shadow-lg active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)' }}
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
