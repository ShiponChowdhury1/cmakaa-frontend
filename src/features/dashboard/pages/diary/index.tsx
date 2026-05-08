import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PARTICIPANTS } from './data';
import type { DiaryParticipant } from './types';
import ParticipantCard from './components/ParticipantCard';
import TrustScoreView from './components/TrustScoreView';
import InviteModal from './components/InviteModal';

export default function DiaryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<DiaryParticipant | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  const filtered = PARTICIPANTS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.handle.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Trust Score Detail View ── */
  if (selectedParticipant) {
    return (
      <TrustScoreView
        participant={selectedParticipant}
        participants={PARTICIPANTS}
        onBack={() => setSelectedParticipant(null)}
        onSelectParticipant={setSelectedParticipant}
      />
    );
  }

  /* ── Participant Diary List View ── */
  return (
    <div className="space-y-5 animate-fade-in pb-24">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Participant Diary
        </h1>
      </div>

      {/* Search + Invite */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search participants..."
            className="flex-1 text-sm bg-transparent border-none outline-none text-[var(--color-dark)] placeholder:text-[#94A3B8]"
          />
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shrink-0"
          style={{ background: '#E57432' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="8.5" cy="7" r="4" />
            <path d="M20 8v6M23 11h-6" />
          </svg>
          Invite
        </button>
      </div>

      {/* Count */}
      <p className="text-sm text-[#64748B]">
        {filtered.length} participant{filtered.length !== 1 ? 's' : ''} in your diary
      </p>

      {/* Participant Cards */}
      <div className="space-y-4">
        {filtered.map((p) => (
          <ParticipantCard
            key={p.id}
            participant={p}
            onViewScore={setSelectedParticipant}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#94A3B8]">No participants found</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <InviteModal
          participants={PARTICIPANTS}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}
