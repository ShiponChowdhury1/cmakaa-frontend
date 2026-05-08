import { useState } from 'react';
import type { DiaryParticipant } from '../types';

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
  const [tab, setTab] = useState<'direct' | 'link'>('direct');
  const [showDiaryPicker, setShowDiaryPicker] = useState(false);
  const [diarySearch, setDiarySearch] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const filtered = participants.filter(
    (p) =>
      p.name.toLowerCase().includes(diarySearch.toLowerCase()) ||
      (p.phone && p.phone.includes(diarySearch))
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
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
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" />
                </svg>
                Pick from Diary
              </button>

              {/* Diary picker dropdown */}
              {showDiaryPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-orange-200 rounded-2xl shadow-lg z-10 overflow-hidden">
                  {/* Search */}
                  <div className="p-3">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-orange-300 bg-white">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                      </svg>
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
                          setContact(p.phone || p.handle);
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
            <div className="mb-5">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-1.5">Phone or Email</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="07700 900000 or email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[var(--color-dark)] placeholder:text-[#94A3B8] outline-none focus:border-[#E57432] transition-colors"
              />
            </div>

            {/* Send Invite */}
            <button
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm cursor-pointer border-none transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ background: '#E57432' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="8.5" cy="7" r="4" />
                <path d="M20 8v6M23 11h-6" />
              </svg>
              Send Invite
            </button>
          </>
        ) : (
          /* Share Link tab */
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E57432" strokeWidth="2">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
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
