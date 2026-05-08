import { useState } from 'react';
import type { NewPardnaFormData, ParticipantEntry } from '../types';
import { DEMO_FORM, EXAMPLE_CONTACTS } from '../types';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors';

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
      participants: [...data.participants, { id: newId, name: '', phone: '' }],
    });
  };

  const selectContact = (id: number, contact: typeof EXAMPLE_CONTACTS[0]) => {
    updateParticipant(id, 'name', contact.name);
    updateParticipant(id, 'phone', contact.phone);
    // Need to do both at once
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

      {/* Warning banner */}
      <div className="rounded-2xl p-4" style={{ background: '#FFF7ED', border: '1px solid #FDDCB5' }}>
        <p className="text-sm font-bold text-[var(--color-dark)] mb-1">
          A pardna is only as strong as its weakest link
        </p>
        <p className="text-xs text-[#64748B] leading-relaxed">
          Choose participants who are <strong className="text-[var(--color-dark)]">punctual, trustworthy, and can comfortably afford</strong> the contributions. As banker, you'll need to chase late payments and cover any shortfalls to keep the cycle moving. Take your time — a strong group protects everyone.
        </p>
      </div>

      {/* Help text */}
      <p className="text-xs text-[#64748B]">
        Add participants now or later. Tap the contact icon to pick from your diary or phone book.
      </p>

      {/* Demo participants button */}
      <button
        type="button"
        onClick={handleDemo}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all border border-dashed border-[#E57432]/40 hover:border-[#E57432]"
        style={{ background: '#FFFBF7', color: '#E57432' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
        <div className="text-left">
          <p className="font-semibold">Demo participants</p>
          <p className="text-xs text-[#B45309] font-normal mt-0.5">One-tap fill names, contacts, and draw order with examples.</p>
        </div>
      </button>

      {/* Sort hint */}
      <div className="flex items-center gap-2 text-xs text-[#64748B]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E57432" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span>Order here = payout order. High-trust members can go first.</span>
        <button
          type="button"
          className="ml-auto text-[#E57432] font-semibold cursor-pointer bg-transparent border-none text-xs hover:underline"
        >
          Sort by trust
        </button>
      </div>

      {/* Participant cards */}
      <div className="space-y-4">
        {data.participants.map((p, index) => (
          <div key={p.id} className="border border-gray-200 rounded-2xl p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[var(--color-dark)]">Participant {index + 1}</h3>
              <button
                onClick={() => removeParticipant(p.id)}
                className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-none transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Full name with search */}
            <div className="relative">
              <div className="relative">
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
                  placeholder="Full name"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchingId(searchingId === p.id ? null : p.id);
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#E57432] bg-transparent border-none cursor-pointer transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </button>
              </div>

              {/* Search contacts dropdown */}
              {searchingId === p.id && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                  <p className="px-3 py-2 text-xs font-bold text-[#64748B] border-b border-gray-100">Search contacts…</p>
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.phone}
                      type="button"
                      onClick={() => selectContact(p.id, contact)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-[#FFF7ED] cursor-pointer bg-transparent border-none transition-colors text-left"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--color-dark)]">{contact.name}</p>
                        <p className="text-xs text-[#94A3B8]">{contact.phone}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: trustColor(contact.trust) }}>
                          {contact.trust}
                        </span>
                        <span className="text-xs font-bold text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                          {contact.score}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Phone number */}
            <div>
              <input
                type="text"
                value={p.phone}
                onChange={(e) => updateParticipant(p.id, 'phone', e.target.value)}
                placeholder="Phone number"
                className={inputClass}
              />
              <p className="text-xs text-[#E57432] mt-1 font-medium">Required</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add another participant */}
      <button
        type="button"
        onClick={addParticipant}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)' }}
      >
        + Add another participant
      </button>

      {/* Confirmation checkbox */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3 cursor-pointer"
        style={{ background: '#FFF7ED', border: '1px solid #FDDCB5' }}
        onClick={() => onChange({ confirmed: !data.confirmed })}
      >
        <div
          className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
          style={{
            borderColor: data.confirmed ? '#E57432' : '#D1D5DB',
            background: data.confirmed ? '#E57432' : 'transparent',
          }}
        >
          {data.confirmed && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
        <p className="text-xs text-[#64748B] leading-relaxed">
          I've reviewed my participants and confirm they are trustworthy, punctual, and able to afford the contributions. I understand that as banker I'll need to step in if anyone falls short.
        </p>
      </div>
    </div>
  );
}
