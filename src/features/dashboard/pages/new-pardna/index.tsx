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

export default function NewPardnaPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepIndex>(0);
  const [form, setForm] = useState<NewPardnaFormData>({ ...INITIAL_FORM });

  const update = (partial: Partial<NewPardnaFormData>) =>
    setForm((prev) => ({ ...prev, ...partial }));

  const next = () => setStep((s) => Math.min(s + 1, 5) as StepIndex);
  const back = () => setStep((s) => Math.max(s - 1, 0) as StepIndex);

  const handleCreate = () => {
    // TODO: Call API to create pardna
    next(); // go to Done step (5)
  };

  const isDone = step === 5;
  const isSummary = step === 4;

  return (
    <div className="space-y-0 animate-fade-in pb-24">

      {/* Header — ← Create Pardna */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => (step === 0 ? navigate('/dashboard') : back())}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0 bg-transparent border-none"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Create Pardna
        </h1>
      </div>

      {/* Tab-style stepper */}
      <div className="flex mb-6">
        {STEP_LABELS.map((label, i) => {
          const isActive = i === step;
          const isPast = i < step;
          return (
            <div key={label} className="flex-1 flex flex-col">
              <span
                className="text-xs pb-2 px-0.5 transition-colors text-center"
                style={{
                  color: isActive ? 'var(--color-dark)' : isPast ? '#E57432' : '#94A3B8',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {label}
              </span>
              <div
                className="h-[3px] rounded-full transition-all duration-500"
                style={{
                  background: isActive ? '#E57432' : isPast ? '#E57432' : '#E5E7EB',
                  opacity: isPast ? 0.5 : 1,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Step content */}
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

      {/* Bottom navigation: Back + Continue / Create & Confirm */}
      {!isDone && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => (step === 0 ? navigate('/dashboard') : back())}
            className="py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all hover:bg-orange-50"
            style={{ background: '#FFFFFF', color: '#E57432', border: '1px solid #E57432' }}
          >
            ← Back
          </button>

          {isSummary ? (
            <button
              onClick={handleCreate}
              className="py-3.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none transition-opacity hover:opacity-90"
              style={{ background: '#E57432' }}
            >
              Create & Confirm
            </button>
          ) : (
            <button
              onClick={next}
              className="py-3.5 rounded-xl text-white text-sm font-semibold cursor-pointer border-none transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)' }}
            >
              Continue →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
