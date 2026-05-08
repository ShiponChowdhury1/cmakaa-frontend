import { useState } from 'react';
import StatsCard from '../../components/StatsCard';

const kycApplications = [
  { id: 'KYC001', name: 'Sarah Johnson',  email: 'sarah.j@email.com',  phone: '+44 7700 900001', submittedAt: '2026-04-15 08:30', documents: ['ID Card', 'Proof of Address'], status: 'pending'  as const },
  { id: 'KYC002', name: 'Donna Richards', email: 'donna.r@email.com',  phone: '+44 7700 900003', submittedAt: '2026-04-14 16:45', documents: ['Passport', 'Utility Bill'],    status: 'pending'  as const },
  { id: 'KYC003', name: 'James King',     email: 'james.k@email.com',  phone: '+44 7700 900004', submittedAt: '2026-04-14 11:20', documents: ['Driver License'],               status: 'pending'  as const },
  { id: 'KYC004', name: 'Mike Thompson',  email: 'mike.t@email.com',   phone: '+44 7700 900002', submittedAt: '2026-04-13 09:00', documents: ['ID Card', 'Bank Statement'],    status: 'approved' as const },
  { id: 'KYC005', name: 'Grace Miller',   email: 'grace.m@email.com',  phone: '+44 7700 900005', submittedAt: '2026-04-12 14:10', documents: ['Passport'],                     status: 'rejected' as const },
];

const pendingCount  = kycApplications.filter(k => k.status === 'pending').length;
const approvedCount = kycApplications.filter(k => k.status === 'approved').length;
const rejectedCount = kycApplications.filter(k => k.status === 'rejected').length;

const stats = [
  {
    label: 'Total Applications',
    value: String(kycApplications.length),
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

export default function KycReviewPage() {
  const [data, setData] = useState(kycApplications);

  const pendingKyc   = data.filter(k => k.status === 'pending');
  const processedKyc = data.filter(k => k.status !== 'pending');

  const handleApprove = (id: string) =>
    setData(prev => prev.map(k => k.id === id ? { ...k, status: 'approved' as const } : k));

  const handleReject = (id: string) =>
    setData(prev => prev.map(k => k.id === id ? { ...k, status: 'rejected' as const } : k));

  return (
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
              {pendingKyc.map((k) => (
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
                      <p className="text-sm font-semibold text-[var(--color-dark)]">{k.name}</p>
                      <p className="text-xs text-[var(--color-gray-400)]">
                        {k.phone} • Submitted {k.submittedAt}
                      </p>
                      {/* Documents */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {k.documents.map((doc) => (
                          <span key={doc} className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {/* Reject */}
                    <button
                      onClick={() => handleReject(k.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-500 text-xs font-medium hover:bg-red-50 transition-all cursor-pointer bg-transparent"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
                      </svg>
                      Reject
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for pending */}
        {pendingKyc.length === 0 && (
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
              {processedKyc.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Status icon */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                      k.status === 'approved' ? 'bg-emerald-100' : 'bg-red-100'
                    }`}>
                      {k.status === 'approved' ? (
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
                      <p className="text-sm font-medium text-[var(--color-gray-500)]">{k.name}</p>
                      <p className="text-xs text-[var(--color-gray-400)]">{k.phone} • {k.submittedAt}</p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border shrink-0 ${
                    k.status === 'approved'
                      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
                      : 'text-red-500 bg-red-50 border-red-200'
                  }`}>
                    {k.status === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
