import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import StatsCard from '../../components/StatsCard';
import { useGetAdminKycQuery, useApproveAdminKycMutation, useDeclineAdminKycMutation } from '@/store/features/adminDashboard/adminDashboardApi';
import type { AdminKycApplication } from '@/store/features/adminDashboard/adminDashboardApi.types';

const PAGE_SIZE = 10;

export default function KycReviewPage() {
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [selectedKycId, setSelectedKycId] = useState<string | null>(null);

  // Pagination State
  const [page, setPage] = useState<number>(1);

  // States for Details Modal
  const [viewingKyc, setViewingKyc] = useState<AdminKycApplication | null>(null);
  const [modalRejectionReason, setModalRejectionReason] = useState<string>('');
  const [isModalRejecting, setIsModalRejecting] = useState<boolean>(false);

  // Fetch KYC applications
  const { data: response, isLoading, isError } = useGetAdminKycQuery({
    page,
    limit: PAGE_SIZE,
  });

  // Mutations
  const [approveKyc] = useApproveAdminKycMutation();
  const [declineKyc] = useDeclineAdminKycMutation();

  const kycApplications = response?.data ?? [];
  const pagination = response?.meta.pagination;
  const statusMeta = response?.meta.status;

  const pendingCount = statusMeta?.PENDING ?? 0;
  const approvedCount = statusMeta?.APPROVED ?? 0;
  const rejectedCount = statusMeta?.REJECTED ?? 0;
  const totalCount = statusMeta?.total ?? pagination?.total ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (page > 3) {
        pages.push('...');
      }
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (page < totalPages - 2) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const stats = [
    {
      label: 'Total Applications',
      value: String(totalCount),
      iconBg: 'bg-blue-50',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
        </svg>
      ),
    },
    {
      label: 'Pending Review',
      value: String(pendingCount),
      iconBg: 'bg-amber-50',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      label: 'Approved',
      value: String(approvedCount),
      iconBg: 'bg-emerald-50',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      ),
    },
    {
      label: 'Rejected',
      value: String(rejectedCount),
      iconBg: 'bg-red-50',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M15 9l-6 6M9 9l6 6" />
        </svg>
      ),
    },
  ];

  const pendingKyc = kycApplications.filter(k => k.status === 'PENDING');
  const processedKyc = kycApplications.filter(k => k.status !== 'PENDING');

  // Find latest state of the currently viewed KYC application from the updated list
  const activeViewingKyc = kycApplications.find(k => k.id === viewingKyc?.id) || viewingKyc;

  const handleApprove = async (id: string) => {
    try {
      await approveKyc(id).unwrap();
    } catch (error) {
      console.error('Failed to approve KYC:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await declineKyc({ kycId: id, rejectionReason }).unwrap();
      setRejectionReason('');
      setSelectedKycId(null);
    } catch (error) {
      console.error('Failed to reject KYC:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
          Loading KYC applications...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          Failed to load KYC applications.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-fade-in">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            KYC Review
          </h1>
          <p className="text-sm text-[var(--color-gray-400)] mt-1">{pendingCount} applications pending review</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((s) => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* KYC card section — same design as Overview */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2 className="text-base font-bold text-[var(--color-dark)]">KYC Applications</h2>
        </div>

        {/* Pending Review group */}
        {pendingKyc.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-amber-600 mb-3">
              Pending Review ({pendingKyc.length})
            </p>
            <div className="space-y-2">
              {pendingKyc.map((k: AdminKycApplication) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-amber-100 bg-amber-50/40 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Amber clock icon */}
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-dark)]">{k.user.firstName} {k.user.lastName}</p>
                      <p className="text-xs text-[var(--color-gray-400)]">
                        {k.user.phoneNumber} • Submitted {new Date(k.submittedAt).toLocaleDateString('en-GB')}
                      </p>
                      {/* Document type */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                          {k.documentType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {/* Details View Eye Button */}
                    <button
                      onClick={() => setViewingKyc(k)}
                      className="flex items-center justify-center p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all cursor-pointer bg-white"
                      title="View Details"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    {/* Decline button with optional reason input */}
                    <div className="flex items-center gap-1">
                      {selectedKycId === k.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            placeholder="Rejection reason (optional)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="px-2 py-1 text-xs border border-red-200 rounded bg-white"
                          />
                          <button
                            onClick={() => handleReject(k.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-all cursor-pointer border-none"
                          >
                            Send
                          </button>
                          <button
                            onClick={() => setSelectedKycId(null)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-all cursor-pointer bg-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => setSelectedKycId(k.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-all cursor-pointer bg-transparent"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
                            </svg>
                            Decline
                          </button>
                          {/* Approve */}
                          <button
                            onClick={() => handleApprove(k.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 active:scale-95 transition-all cursor-pointer border-none shadow-sm"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                            </svg>
                            Approve
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for pending */}
        {pendingKyc.length === 0 && processedKyc.length > 0 && (
          <div className="flex flex-col items-center justify-center py-10 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" />
              </svg>
            </div>
            <p className="text-sm font-medium text-[var(--color-gray-500)]">All applications reviewed!</p>
            <p className="text-xs text-[var(--color-gray-400)]">No pending applications at the moment.</p>
          </div>
        )}

        {/* Processed group */}
        {processedKyc.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[var(--color-gray-400)] mb-3">Processed</p>
            <div className="space-y-2">
              {processedKyc.map((k: AdminKycApplication) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Status icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      k.status === 'APPROVED' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      {k.status === 'APPROVED' ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                        </svg>
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-gray-500)]">{k.user.firstName} {k.user.lastName}</p>
                      <p className="text-xs text-[var(--color-gray-400)]">{k.user.phoneNumber} • {new Date(k.submittedAt).toLocaleDateString('en-GB')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Details View Eye Button */}
                    <button
                      onClick={() => setViewingKyc(k)}
                      className="flex items-center justify-center p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all cursor-pointer bg-white"
                      title="View Details"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>

                    {/* Status badge */}
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                      k.status === 'APPROVED'
                        ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                        : 'text-red-500 bg-red-50 border-red-200'
                    }`}>
                      {k.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-[var(--color-gray-400)]">
              Showing{' '}
              <span className="font-semibold text-[var(--color-dark)]">
                {Math.min((page-1)*PAGE_SIZE+1, totalCount)}–{Math.min(page*PAGE_SIZE, totalCount)}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-[var(--color-dark)]">{totalCount}</span>{' '}
              applications
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 hover:text-[var(--color-dark)] transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              {getPageNumbers().map((n, idx) => {
                if (n === '...') {
                  return (
                    <span key={`dots-${idx}`} className="px-1.5 text-xs font-semibold text-[var(--color-gray-400)] select-none">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={n}
                    onClick={() => setPage(Number(n))}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none ${
                      n === page ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-gray-500)] hover:bg-gray-100'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-[var(--color-gray-500)] hover:bg-gray-50 hover:text-[var(--color-dark)] transition-all cursor-pointer bg-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Details View Modal */}
      {viewingKyc && activeViewingKyc && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-bold text-[var(--color-dark)] flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                  KYC Application Details
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    activeViewingKyc.status === 'APPROVED'
                      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                      : activeViewingKyc.status === 'REJECTED'
                      ? 'text-red-500 bg-red-50 border-red-200'
                      : 'text-amber-600 bg-amber-50 border-amber-200'
                  }`}>
                    {activeViewingKyc.status}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => {
                  setViewingKyc(null);
                  setModalRejectionReason('');
                  setIsModalRejecting(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg cursor-pointer bg-transparent border-none"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* User details card */}
              <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-[var(--color-gray-400)]">User Full Name</p>
                  <p className="text-sm font-semibold text-[var(--color-dark)] mt-0.5">
                    {activeViewingKyc.user.firstName} {activeViewingKyc.user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-gray-400)]">Document Type</p>
                  <p className="text-sm font-semibold text-[var(--color-dark)] mt-0.5">
                    {activeViewingKyc.documentType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-gray-400)]">Email Address</p>
                  <p className="text-sm text-[var(--color-dark)] mt-0.5">
                    {activeViewingKyc.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-gray-400)]">Phone Number</p>
                  <p className="text-sm text-[var(--color-dark)] mt-0.5">
                    {activeViewingKyc.user.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-gray-400)]">Submitted At</p>
                  <p className="text-sm text-[var(--color-dark)] mt-0.5">
                    {new Date(activeViewingKyc.submittedAt).toLocaleString('en-GB')}
                  </p>
                </div>
                {activeViewingKyc.notes && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-medium text-[var(--color-gray-400)]">User Notes</p>
                    <p className="text-sm text-[var(--color-dark)] mt-1 bg-white p-3 rounded-lg border border-gray-100 italic">
                      "{activeViewingKyc.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Document Previews */}
              <div>
                <h4 className="text-sm font-bold text-[var(--color-dark)] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                  Uploaded Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Front */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col">
                    <p className="text-xs font-semibold text-gray-500 p-2 border-b border-gray-100 bg-white">
                      Document Front
                    </p>
                    <a
                      href={activeViewingKyc.documentFront}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-[4/3] group overflow-hidden block"
                    >
                      <img
                        src={activeViewingKyc.documentFront}
                        alt="Front"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                        Open Original
                      </div>
                    </a>
                  </div>

                  {/* Back */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col">
                    <p className="text-xs font-semibold text-gray-500 p-2 border-b border-gray-100 bg-white">
                      Document Back
                    </p>
                    <a
                      href={activeViewingKyc.documentBack}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-[4/3] group overflow-hidden block"
                    >
                      <img
                        src={activeViewingKyc.documentBack}
                        alt="Back"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                        Open Original
                      </div>
                    </a>
                  </div>

                  {/* Selfie */}
                  <div className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col">
                    <p className="text-xs font-semibold text-gray-500 p-2 border-b border-gray-100 bg-white">
                      Selfie with Document
                    </p>
                    <a
                      href={activeViewingKyc.selfieUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-[4/3] group overflow-hidden block"
                    >
                      <img
                        src={activeViewingKyc.selfieUrl}
                        alt="Selfie"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                        </svg>
                        Open Original
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Review details if reviewed */}
              {activeViewingKyc.status !== 'PENDING' && (
                <div className="border-t border-gray-100 pt-5 space-y-3">
                  <h4 className="text-sm font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
                    Review Information
                  </h4>
                  <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeViewingKyc.reviewedAt && (
                      <div>
                        <p className="text-xs font-medium text-[var(--color-gray-400)]">Reviewed At</p>
                        <p className="text-sm text-[var(--color-dark)] mt-0.5">
                          {new Date(activeViewingKyc.reviewedAt).toLocaleString('en-GB')}
                        </p>
                      </div>
                    )}
                    {activeViewingKyc.reviewedBy && (
                      <div>
                        <p className="text-xs font-medium text-[var(--color-gray-400)]">Reviewed By</p>
                        <p className="text-sm text-[var(--color-dark)] mt-0.5">
                          Admin ID: {activeViewingKyc.reviewedBy}
                        </p>
                      </div>
                    )}
                    {activeViewingKyc.status === 'REJECTED' && activeViewingKyc.rejectionReason && (
                      <div className="md:col-span-2">
                        <p className="text-xs font-medium text-red-500">Rejection Reason</p>
                        <p className="text-sm font-semibold text-red-700 mt-1 bg-red-50/50 p-3 rounded-lg border border-red-100">
                          {activeViewingKyc.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-end gap-3 rounded-b-2xl sticky bottom-0 z-10">
              {activeViewingKyc.status === 'PENDING' ? (
                <div className="flex items-center gap-2 w-full justify-between">
                  {isModalRejecting ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        placeholder="Reason for rejection (optional)"
                        value={modalRejectionReason}
                        onChange={(e) => setModalRejectionReason(e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-red-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-red-400"
                        autoFocus
                      />
                      <button
                        onClick={async () => {
                          try {
                            await declineKyc({ kycId: activeViewingKyc.id, rejectionReason: modalRejectionReason }).unwrap();
                            setViewingKyc(null);
                            setModalRejectionReason('');
                            setIsModalRejecting(false);
                          } catch (err) {
                            console.error('Failed to reject:', err);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 cursor-pointer border-none transition-colors"
                      >
                        Confirm Decline
                      </button>
                      <button
                        onClick={() => {
                          setIsModalRejecting(false);
                          setModalRejectionReason('');
                        }}
                        className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-100 cursor-pointer bg-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsModalRejecting(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-all cursor-pointer bg-transparent"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
                        </svg>
                        Decline
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingKyc(null)}
                          className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-100 transition-all cursor-pointer bg-white"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await approveKyc(activeViewingKyc.id).unwrap();
                              setViewingKyc(null);
                            } catch (err) {
                              console.error('Failed to approve:', err);
                            }
                          }}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 active:scale-95 transition-all cursor-pointer border-none shadow-sm"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                          </svg>
                          Approve
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setViewingKyc(null)}
                  className="px-5 py-2 rounded-xl bg-[var(--color-dark)] text-white text-sm font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
