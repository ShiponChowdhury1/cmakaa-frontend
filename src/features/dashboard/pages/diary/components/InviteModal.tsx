import { useState } from 'react';
import { FaUserPlus, FaLink, FaCalendar, FaSearch, FaPaperPlane } from 'react-icons/fa';
import type { DiaryParticipant } from '../types';
import { useCreateDiaryContactMutation } from '../../../../../store/features/diaryContacts/diaryContactsApi';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { toast } from 'react-toastify';

function trustBg(t: number) {
  if (t >= 90) return '#F0FDF4';
  if (t >= 80) return '#FFF7ED';
  if (t >= 70) return '#FFFBEB';
  return '#FEF2F2';
}
function trustColor(t: number) {
  if (t >= 90) return '#16A34A';
  if (t >= 80) return '#E57432';
  if (t >= 70) return '#EA580C';
  return '#DC2626';
}

interface Props {
  participants: DiaryParticipant[];
  onClose: () => void;
}

export default function InviteModal({ participants, onClose }: Props) {
  const [createDiaryContact, { isLoading }] = useCreateDiaryContactMutation();
  const [tab, setTab] = useState<'direct' | 'link'>('direct');
  const [showDiaryPicker, setShowDiaryPicker] = useState(false);
  const [diarySearch, setDiarySearch] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(diarySearch.toLowerCase()) ||
      (p.handle && p.handle.includes(diarySearch))
  );

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(5,10,20,0.45)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-gray-100 p-6 overflow-y-auto"
        style={{ background: '#FFF8F3', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Invite to PardnaBook
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer bg-transparent border-none transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden mb-5 border border-gray-200">
          <button
            onClick={() => setTab('direct')}
            className="flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border-none transition-all"
            style={{
              background: tab === 'direct' ? '#E57432' : '#FFFFFF',
              color: tab === 'direct' ? '#FFFFFF' : '#64748B',
            }}
          >
            <FaUserPlus size={14} />
            Direct Invite
          </button>
          <button
            onClick={() => setTab('link')}
            className="flex-1 py-2.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer border-none transition-all"
            style={{
              background: tab === 'link' ? '#E57432' : '#FFFFFF',
              color: tab === 'link' ? '#FFFFFF' : '#64748B',
            }}
          >
            <FaLink size={14} />
            Share Link
          </button>
        </div>

        {tab === 'direct' ? (
          <>
            {/* Pick from Diary */}
            <div className="relative mb-4">
              <button
                onClick={() => setShowDiaryPicker(!showDiaryPicker)}
                className="w-full py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-[var(--color-dark)] cursor-pointer flex items-center justify-center gap-2 hover:border-gray-300 transition-colors"
              >
                <FaCalendar size={14} />
                Pick from Diary
              </button>

              {/* Diary picker dropdown */}
              {showDiaryPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                  {/* Search */}
                  <div className="p-3">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-orange-300 bg-white">
                      <FaSearch size={14} color="#94A3B8" />
                      <input
                        type="text"
                        value={diarySearch}
                        onChange={(e) => setDiarySearch(e.target.value)}
                        placeholder="Search diary..."
                        className="flex-1 text-sm bg-transparent border-none outline-none text-[var(--color-dark)] placeholder:text-[#94A3B8]"
                      />
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-72 overflow-y-auto px-3 pb-3 space-y-1">
                    {filtered.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setName(p.name);
                          setPhone(p.phone || '');
                          setShowDiaryPicker(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer bg-transparent border-none transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#23334D] text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {p.initials}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-[var(--color-dark)]">{p.name}</p>
                            <p className="text-xs text-[#64748B]">{p.phone || p.handle}</p>
                          </div>
                        </div>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: trustBg(p.trust), color: trustColor(p.trust) }}
                        >
                          {p.trust}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-semibold text-[#94A3B8] tracking-wider">OR ENTER MANUALLY</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Name */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Participant's full name"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors"
              />
            </div>

            {/* Phone or Email */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-1.5">Phone</label>
              <PhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={(val) => setPhone(val || '')}
                defaultCountry="GB"
                className="custom-phone-input"
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors"
              />
            </div>

            {/* Notes */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-1.5">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes about this participant (optional)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors resize-none"
                rows={3}
              />
            </div>

            {/* Send Invite */}
            <button
              onClick={async () => {
                if (!name.trim() || !email.trim() || !phone.trim()) {
                  toast.error('Please fill in all required fields');
                  return;
                }
                try {
                  await createDiaryContact({
                    fullName: name,
                    email,
                    phone,
                    notes: notes.trim() || undefined,
                  }).unwrap();
                  toast.success('🎉 Invite sent successfully!');
                  // Reset form
                  setName('');
                  setEmail('');
                  setPhone('');
                  setNotes('');
                  onClose();
                } catch (error: any) {
                  console.error('Failed to create diary contact:', error);
                  toast.error(error?.data?.message || 'Failed to send invite. Please try again.');
                }
              }}
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: '#E57432' }}
            >
              <FaPaperPlane size={14} />
              {isLoading ? 'Saving...' : 'Save & Send Invite'}
            </button>
          </>
        ) : (
          /* Share Link tab */
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
              <FaLink size={28} color="#E57432" />
            </div>
            <p className="text-sm text-[#64748B] mb-4">Share your unique invite link</p>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200">
              <input
                type="text"
                value="https://pardnabook.com/invite/abc123"
                readOnly
                className="flex-1 text-sm bg-transparent border-none outline-none text-[var(--color-dark)]"
              />
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white border-none cursor-pointer hover:opacity-90" style={{ background: '#E57432' }}>
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
