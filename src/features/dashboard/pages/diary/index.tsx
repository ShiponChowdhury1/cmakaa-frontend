import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  Phone,
  FileText,
  Calendar,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch diary contacts from API
  const { data: diaryContacts = [], isLoading, error, refetch } = useGetDiaryContactsQuery();
  
  // Filter diary contacts by search
  const filtered = useMemo(() => {
    return diaryContacts.filter(
      (contact) =>
        contact.fullName.toLowerCase().includes(search.toLowerCase()) ||
        contact.email.toLowerCase().includes(search.toLowerCase()) ||
        contact.phone.includes(search)
    );
  }, [diaryContacts, search]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const getPageNumbers = () => {
    const windowSize = 3;
    const chunkStart = Math.floor((safeCurrentPage - 1) / windowSize) * windowSize + 1;
    const chunkEnd = Math.min(chunkStart + windowSize - 1, totalPages);
    const pages: number[] = [];
    for (let i = chunkStart; i <= chunkEnd; i++) {
      pages.push(i);
    }
    return pages;
  };

  const paginatedContacts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [filtered, safeCurrentPage, itemsPerPage]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'C';
  };

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
    <>
      <div className="space-y-5 animate-fade-in pb-24">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-lg font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
          Participant Diary
        </h1>
      </div>

      {/* Search + Invite */}
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search participants..."
            className="flex-1 text-sm bg-transparent border-none outline-none text-[var(--color-dark)] placeholder:text-[#94A3B8]"
          />
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90 active:scale-95 shrink-0 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #E57432 0%, #F4A261 100%)' }}
        >
          <UserPlus className="w-4 h-4" />
          Invite
        </button>
      </div>

      {/* Count */}
      <p className="text-sm font-semibold text-[#64748B]">
        {filtered.length} contact{filtered.length !== 1 ? 's' : ''} in your diary
      </p>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-[#E57432] animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading contacts...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 bg-red-50/50 rounded-2xl border border-red-100 p-6">
          <p className="text-sm font-semibold text-red-500">Failed to load contacts</p>
          <p className="text-xs text-gray-500 mt-1">Please try refreshing the page.</p>
        </div>
      )}

      {/* Diary Contact Cards */}
      {!isLoading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                <div>
                  {/* Contact Header with Initials & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Initials bubble */}
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#E57432] flex items-center justify-center text-sm font-bold shrink-0 border border-orange-100/50">
                        {getInitials(contact.fullName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[var(--color-dark)] truncate">{contact.fullName}</p>
                        <p className="text-[11px] text-[#E57432] font-semibold truncate mt-0.5">{contact.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="p-1.5 rounded-lg border border-gray-100 hover:border-orange-100 hover:bg-orange-50 text-gray-500 hover:text-[#E57432] transition-colors cursor-pointer bg-white"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="p-1.5 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer bg-white"
                        title="Edit contact"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-[#64748B] bg-gray-50 px-3 py-2 rounded-xl border border-gray-100/50">
                      <Phone className="w-3.5 h-3.5 text-[#E57432] shrink-0" />
                      <span className="truncate font-semibold">{contact.phone}</span>
                    </div>
                    {contact.notes && (
                      <div className="flex items-start gap-2 text-xs text-[#64748B] px-1 py-1">
                        <FileText className="w-3.5 h-3.5 text-[#E57432] shrink-0 mt-0.5" />
                        <span className="flex-1 line-clamp-2 text-gray-500 leading-relaxed">{contact.notes}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 text-[10px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-300" />
                    Added {new Date(contact.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 text-gray-300" />
                    Updated {new Date(contact.updatedAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state within pagination */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 border border-orange-100/50">
                <Search className="w-5 h-5 text-[#E57432]" />
              </div>
              <p className="text-sm font-bold text-[var(--color-dark)]">No contacts found</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                {diaryContacts.length === 0 
                  ? 'No contacts yet. Invite someone to get started!' 
                  : 'No contacts match your current search criteria.'}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-1.5 sm:gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1.5">
                {getPageNumbers().map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`w-7 sm:w-8 h-7 sm:h-8 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
                      safeCurrentPage === n
                        ? 'bg-[#E57432] text-white shadow-md shadow-orange-500/20'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      </div>

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
    </>
  );
}
