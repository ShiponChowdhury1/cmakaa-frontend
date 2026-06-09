import { useState, useEffect } from 'react';
import type { NewPardnaFormData, ParticipantEntry } from '../types';
import {
  Zap, ChevronRight, User, Mail, Phone, Trash2,
  UserPlus, Users, Check
} from 'lucide-react';
import { useGetDiaryContactsQuery } from '../../../../../store/features/diaryContacts/diaryContactsApi';

interface Props {
  data: NewPardnaFormData;
  onChange: (d: Partial<NewPardnaFormData>) => void;
}

const inputClass =
  'w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#C0C8D4] outline-none focus:border-[#E57432] focus:ring-4 focus:ring-[#E57432]/8 transition-all font-medium';



export default function StepParticipants({ data, onChange }: Props) {
  const [searchingId, setSearchingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch diary contacts from RTK Query
  const { data: diaryContacts = [], isLoading } = useGetDiaryContactsQuery();

  const [isToggleOn, setIsToggleOn] = useState(false);
  const [hasInitializedToggle, setHasInitializedToggle] = useState(false);
  const [originalCount] = useState(() => data.participants.length);

  useEffect(() => {
    if (diaryContacts.length > 0 && !hasInitializedToggle) {
      const matches =
        data.participants.length === diaryContacts.length &&
        data.participants.every((p, index) => {
          const contact = diaryContacts[index];
          return (
            contact &&
            p.name === contact.fullName &&
            (p.email || '') === (contact.email || '') &&
            p.phone === contact.phone
          );
        });
      if (matches) {
        setIsToggleOn(true);
      }
      setHasInitializedToggle(true);
    }
  }, [diaryContacts, hasInitializedToggle, data.participants]);

  const handleToggle = () => {
    if (diaryContacts.length === 0) return;

    if (!isToggleOn) {
      // Map all available diary contacts to participants
      const newParticipants = diaryContacts.map((contact, index) => ({
        id: index + 1,
        name: contact.fullName,
        email: contact.email || '',
        phone: contact.phone,
      }));

      onChange({
        participants: newParticipants,
        numberOfParticipants: newParticipants.length.toString(),
      });
      setIsToggleOn(true);
    } else {
      // Clear data and reset to a single empty participant field
      onChange({
        participants: [{ id: 1, name: '', email: '', phone: '' }],
        numberOfParticipants: '1',
      });
      setIsToggleOn(false);
    }
  };

  const updateParticipant = (id: number, field: keyof ParticipantEntry, value: string) => {
    setIsToggleOn(false);
    onChange({
      participants: data.participants.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    });
  };

  const removeParticipant = (id: number) => {
    setIsToggleOn(false);
    if (data.participants.length <= 1) return;
    onChange({ participants: data.participants.filter((p) => p.id !== id) });
  };

  const addParticipant = () => {
    setIsToggleOn(false);
    const newId = Math.max(0, ...data.participants.map((p) => p.id)) + 1;
    onChange({
      participants: [...data.participants, { id: newId, name: '', email: '', phone: '' }],
    });
  };

  const selectContact = (
    id: number,
    contact: { name: string; phone: string; email?: string }
  ) => {
    setIsToggleOn(false);
    onChange({
      participants: data.participants.map((p) =>
        p.id === id
          ? {
              ...p,
              name: contact.name,
              phone: contact.phone,
              email: contact.email || p.email,
            }
          : p
      ),
    });
    setSearchingId(null);
    setSearchQuery('');
  };

  // Format database diary contacts as suggested contacts
  const allSuggestedContacts = (diaryContacts || []).map((c) => ({
    key: `diary-${c.id}`,
    name: c.fullName,
    phone: c.phone,
    email: c.email,
  }));

  const filteredContacts = allSuggestedContacts.filter((c) => {
    // Hide already selected participants to prevent duplicate selection in other fields
    const isAlreadyAdded = data.participants.some(
      (participant) =>
        participant.id !== searchingId &&
        participant.name.trim().toLowerCase() === c.name.trim().toLowerCase()
    );
    if (isAlreadyAdded) return false;

    const query = searchQuery.trim().toLowerCase();
    // If the query is empty or matches the current participant's name exactly (on focus),
    // show all non-added suggested contacts.
    const activeParticipant = data.participants.find((p) => p.id === searchingId);
    if (!query || (activeParticipant && query === activeParticipant.name.trim().toLowerCase())) {
      return true;
    }

    return (
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      (c.email && c.email.toLowerCase().includes(query))
    );
  });

  const filledCount = data.participants.filter((p) => p.name.trim() && p.email.trim() && p.phone.trim()).length;
  const isFull = (p: ParticipantEntry) => !!(p.name.trim() && p.email.trim() && p.phone.trim());

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toggle switch for Diary Auto-fill - Commented out for now
      <div
        className="flex items-center justify-between p-4 rounded-2xl border transition-all"
        style={{
          background: isToggleOn ? 'rgba(229, 116, 50, 0.02)' : '#FFFFFF',
          borderColor: isToggleOn ? '#E57432' : '#F1F5F9',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{
              background: isToggleOn ? 'linear-gradient(135deg, #E57432, #F4A261)' : '#F8FAFC',
              color: isToggleOn ? '#FFFFFF' : '#94A3B8',
            }}
          >
            <Users size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--color-dark)]">Use Diary Contacts</p>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              {diaryContacts.length === 0
                ? 'No contacts in your diary to auto-fill'
                : isToggleOn
                ? 'Populated with your diary contacts'
                : 'Automatically load details from your contacts'}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={diaryContacts.length === 0}
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${
            isToggleOn ? 'bg-[#E57432]' : 'bg-gray-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isToggleOn ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
      */}

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


      {/* Participant cards */}
      <div className="space-y-4">
        {data.participants.map((p, index) => {
          const complete = isFull(p);
          const isSearching = searchingId === p.id;
          return (
            <div
              key={p.id}
              className="rounded-2xl transition-all relative"
              style={{
                border: complete ? '1px solid #10B981' : '1px solid #F1F5F9',
                boxShadow: complete ? '0 4px 16px rgba(16,185,129,0.08)' : '0 1px 4px rgba(0,0,0,0.03)',
                zIndex: isSearching ? 30 : 1,
              }}
            >
              {/* Card header */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-t-2xl"
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
              <div className="p-4 space-y-3 bg-white rounded-b-2xl">
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
                  {searchingId === p.id && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-2xl z-10 max-h-52 overflow-y-auto">
                      <p className="px-4 py-2.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest border-b border-gray-50">
                        Suggested contacts
                      </p>
                      {isLoading ? (
                        <div className="px-4 py-4 text-center text-xs text-[#94A3B8]">
                          Loading contacts...
                        </div>
                      ) : filteredContacts.length > 0 ? (
                        filteredContacts.map((contact) => (
                          <button
                            key={contact.key}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectContact(p.id, contact)}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-orange-50/60 cursor-pointer bg-transparent border-none transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-[11px] font-bold text-gray-500">
                                {(contact.name || 'Anonymous').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[var(--color-dark)]">{contact.name}</p>
                                <p className="text-[10px] text-[#94A3B8]">{contact.phone}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-[#E57432] bg-[#E57432]/10">
                              Diary Contact
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-4 text-center text-xs text-[#94A3B8]">
                          {diaryContacts.length === 0
                            ? 'No contacts in your diary yet.'
                            : 'No matching contacts found.'}
                        </div>
                      )}
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
        className="w-full py-4 rounded-2xl font-bold text-sm cursor-pointer border border-dashed border-[#E57432]/25 text-[#E57432] bg-transparent hover:bg-orange-50/50 hover:border-[#E57432]/50 transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
      >
        <UserPlus size={18} />
        Add Another Participant
      </button>


    </div>
  );
}
