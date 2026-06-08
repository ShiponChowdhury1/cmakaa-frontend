import { useState } from 'react';
import type { NewPardnaFormData, ParticipantEntry } from '../types';
import { DEMO_FORM, EXAMPLE_CONTACTS } from '../types';
import {
  Zap, ChevronRight, User, Mail, Phone, Trash2, PlusCircle,
  CheckCircle2, Shield, UserPlus, Check
} from 'lucide-react';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

const inputClass =
  'w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-gray-100 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#C0C8D4] outline-none focus:border-[#E57432] focus:ring-4 focus:ring-[#E57432]/8 transition-all font-medium';

function trustColor(trust: string) {
  if (trust === 'Strong') return '#10B981';
  if (trust === 'Fair') return '#F59E0B';
  if (trust === 'Developing') return '#3B82F6';
  return '#EF4444';
}

export default function StepParticipants({ data, onChange }: Props) {
  const [searchingId, setSearchingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDemo = () => {
    onChange({
      participants: DEMO_FORM.participants,
      confirmed: true,
    });
  };

  const updateParticipant = (id: number, field: keyof ParticipantEntry, value: string) => {
    onChange({
      participants: data.participants.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const removeParticipant = (id: number) => {
    if (data.participants.length <= 1) return;
    onChange({ participants: data.participants.filter((p) => p.id !== id) });
  };

  const addParticipant = () => {
    const newId = Math.max(0, ...data.participants.map((p) => p.id)) + 1;
    onChange({
      participants: [...data.participants, { id: newId, name: '', email: '', phone: '' }],
    });
  };

  const selectContact = (id: number, contact: typeof EXAMPLE_CONTACTS[0]) => {
    onChange({
      participants: data.participants.map((p) =>
        p.id === id ? { ...p, name: contact.name, phone: contact.phone } : p
      ),
    });
    setSearchingId(null);
    setSearchQuery('');
  };

  const filteredContacts = EXAMPLE_CONTACTS.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filledCount = data.participants.filter((p) => p.name.trim() && p.email.trim() && p.phone.trim()).length;
  const isFull = (p: ParticipantEntry) => !!(p.name.trim() && p.email.trim() && p.phone.trim());

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
          <p className="font-bold text-[#E57432] text-sm">Demo participants</p>
          <p className="text-[11px] text-[#B45309] mt-0.5">Auto-fill with example contacts</p>
        </div>
        <ChevronRight size={16} className="text-[#E57432]" />
      </button>

      {/* Section title + progress */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Add Participants
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">Add the people joining your savings group</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: filledCount === data.participants.length && filledCount > 0 ? '#ECFDF5' : '#FFF7ED' }}>
          <span className="text-xs font-bold" style={{ color: filledCount === data.participants.length && filledCount > 0 ? '#10B981' : '#E57432' }}>
            {filledCount}/{data.participants.length} complete
          </span>
        </div>
      </div>

      {/* Trust warning */}
      <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'linear-gradient(135deg, #FFF7ED, #FEF9E7)', border: '1.5px solid #FDDCB5' }}>
        <div className="w-9 h-9 rounded-xl bg-[#E57432]/10 flex items-center justify-center shrink-0">
          <Shield size={18} className="text-[#E57432]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--color-dark)] mb-0.5">Choose wisely</p>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Pick members who are <strong className="text-[var(--color-dark)]">punctual & trustworthy</strong>. As banker, you cover any shortfalls.
          </p>
        </div>
      </div>

      {/* Participant cards */}
      <div className="space-y-4">
        {data.participants.map((p, index) => {
          const complete = isFull(p);
          return (
            <div
              key={p.id}
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                border: complete ? '2px solid #10B981' : '2px solid #F1F5F9',
                boxShadow: complete ? '0 4px 16px rgba(16,185,129,0.08)' : '0 1px 4px rgba(0,0,0,0.03)',
              }}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ background: complete ? '#F0FDF4' : '#F8FAFC' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: complete ? '#10B981' : p.name.trim() ? '#E57432' : '#CBD5E1' }}
                  >
                    {complete ? <Check size={14} strokeWidth={3} /> : index + 1}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[var(--color-dark)]">
                      {p.name.trim() || `Participant ${index + 1}`}
                    </span>
                    {complete && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-2">
                        ✓ Ready
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeParticipant(p.id)}
                  disabled={data.participants.length <= 1}
                  className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 cursor-pointer bg-transparent border-none transition-all rounded-xl hover:bg-red-50 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Card body */}
              <div className="p-4 space-y-3 bg-white">
                {/* Full name */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => {
                      updateParticipant(p.id, 'name', e.target.value);
                      setSearchingId(p.id);
                      setSearchQuery(e.target.value);
                    }}
                    onFocus={() => {
                      setSearchingId(p.id);
                      setSearchQuery(p.name);
                    }}
                    onBlur={() => setTimeout(() => setSearchingId(null), 200)}
                    placeholder="Full name"
                    className={inputClass}
                  />
                  {/* Contacts dropdown */}
                  {searchingId === p.id && filteredContacts.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl z-10 max-h-52 overflow-y-auto">
                      <p className="px-4 py-2.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest border-b border-gray-50">
                        Suggested contacts
                      </p>
                      {filteredContacts.map((contact) => (
                        <button
                          key={contact.phone}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => selectContact(p.id, contact)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50/60 cursor-pointer bg-transparent border-none transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-[11px] font-bold text-gray-500">
                              {contact.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[var(--color-dark)]">{contact.name}</p>
                              <p className="text-[10px] text-[#94A3B8]">{contact.phone}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg" style={{ color: trustColor(contact.trust), background: `${trustColor(contact.trust)}12` }}>
                            {contact.trust} · {contact.score}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Email + Phone row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      <Mail size={15} />
                    </div>
                    <input
                      type="email"
                      value={p.email || ''}
                      onChange={(e) => updateParticipant(p.id, 'email', e.target.value)}
                      placeholder="Email address"
                      className={inputClass}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      <Phone size={15} />
                    </div>
                    <input
                      type="tel"
                      value={p.phone}
                      onChange={(e) => updateParticipant(p.id, 'phone', e.target.value)}
                      placeholder="Phone number"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add participant */}
      <button
        type="button"
        onClick={addParticipant}
        className="w-full py-4 rounded-2xl font-bold text-sm cursor-pointer border-2 border-dashed border-[#E57432]/25 text-[#E57432] bg-transparent hover:bg-orange-50/50 hover:border-[#E57432]/50 transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
      >
        <UserPlus size={18} />
        Add Another Participant
      </button>

      {/* Confirmation */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3.5 cursor-pointer transition-all hover:shadow-sm"
        style={{
          background: data.confirmed ? 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' : '#F8FAFC',
          border: data.confirmed ? '2px solid #10B981' : '2px solid #F1F5F9',
        }}
        onClick={() => onChange({ confirmed: !data.confirmed })}
      >
        <div
          className="w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
          style={{
            borderColor: data.confirmed ? '#10B981' : '#D1D5DB',
            background: data.confirmed ? '#10B981' : 'transparent',
          }}
        >
          {data.confirmed && (
            <Check size={14} className="text-white" strokeWidth={3} />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--color-dark)] mb-0.5">
            {data.confirmed ? '✓ Responsibility confirmed' : 'Confirm your responsibility'}
          </p>
          <p className="text-xs text-[#64748B] leading-relaxed">
            I confirm all participants are <strong className="text-[var(--color-dark)]">trustworthy and able to contribute</strong>. I understand my responsibilities as banker.
          </p>
        </div>
      </div>
    </div>
  );
}
