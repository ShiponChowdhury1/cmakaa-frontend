import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import { GrFormView } from 'react-icons/gr';
import { MdPhone, MdNotes } from 'react-icons/md';
import { PARTICIPANTS } from './data';
import type { DiaryParticipant } from './types';
import TrustScoreView from './components/TrustScoreView';
import InviteModal from './components/InviteModal';
import ContactDetailModal from './components/ContactDetailModal';
import { useGetDiaryContactsQuery } from '../../../../store/features/diaryContacts/diaryContactsApi';
import type { DiaryContact } from '../../../../store/features/diaryContacts/diaryContactsApi.types';

export default function DiaryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState<DiaryParticipant | null>(null);
  const [showInvite, setShowInvite] = useState(false);
  const [selectedContact, setSelectedContact] = useState<DiaryContact | null>(null);
  
  // Fetch diary contacts from API
  const { data: diaryContacts = [], isLoading, error, refetch } = useGetDiaryContactsQuery();
  
  // Filter diary contacts by search
  const filtered = diaryContacts.filter(
    (contact) =>
      contact.fullName.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase()) ||
      contact.phone.includes(search)
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
        {filtered.length} contact{filtered.length !== 1 ? 's' : ''} in your diary
      </p>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-sm text-[#94A3B8]">Loading contacts...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-sm text-red-500">Failed to load contacts</p>
        </div>
      )}

      {/* Diary Contact Cards */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Contact Header with Actions */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-[var(--color-dark)] truncate">{contact.fullName}</p>
                  <p className="text-xs text-[#E57432] mt-1 truncate">{contact.email}</p>
                </div>
                <div className="flex items-center gap-1.5 ml-4 shrink-0">
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="p-2 rounded-lg hover:bg-orange-50 cursor-pointer border-none bg-transparent transition-colors text-[#E57432] hover:text-[#D46028]"
                    title="View details"
                  >
                    <GrFormView size={16} />
                  </button>
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="p-2 rounded-lg hover:bg-blue-50 cursor-pointer border-none bg-transparent transition-colors text-blue-500 hover:text-blue-600"
                    title="Edit contact"
                  >
                    <FaEdit size={16} />
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <MdPhone size={14} color="#E57432" className="shrink-0" />
                  <span className="truncate">{contact.phone}</span>
                </div>
                {contact.notes && (
                  <div className="flex items-start gap-2 text-sm text-[#64748B]">
                    <MdNotes size={14} color="#E57432" className="shrink-0 mt-0.5" />
                    <span className="flex-1 line-clamp-2">{contact.notes}</span>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-[#94A3B8]">
                <span>Added {new Date(contact.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
                <span>Updated {new Date(contact.updatedAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-sm text-[#94A3B8]">
                {diaryContacts.length === 0 ? 'No contacts yet. Invite someone to get started!' : 'No contacts match your search'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <InviteModal
          participants={PARTICIPANTS}
          onClose={() => {
            setShowInvite(false);
            refetch();
          }}
        />
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <ContactDetailModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onSuccess={() => {
            setSelectedContact(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
