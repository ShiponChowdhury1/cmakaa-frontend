import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, Calendar, Shield, RefreshCw, CheckCircle2, CreditCard, X } from 'lucide-react';
import { useGetMyKycQuery } from '@/store/features/kyc/kycApi';
import { useAppSelector } from '@/store';
import type { KycDocumentType } from '@/store/features/kyc/kycApi.types';

const DOCUMENT_TYPE_LABELS: Record<KycDocumentType, string> = {
  NID: 'National ID Card',
  PASSPORT: 'Passport',
  DRIVING_LICENSE: 'Driving License',
};

export default function KycPendingPage() {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const { data: response, isLoading, refetch } = useGetMyKycQuery();
  const kycData = response?.data;

  const isApproved = kycData?.status === 'APPROVED' || user?.kycStatus === 'APPROVED';

  // Lightbox Modal state
  const [activePreview, setActivePreview] = useState<{ label: string; url: string } | null>(null);

  // If user is approved now, navigate to dashboard
  useEffect(() => {
    if (isApproved) {
      navigate('/dashboard', { replace: true });
    }
  }, [isApproved, navigate]);

  if (isApproved) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-[#E57432] border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--color-gray-500)]">Loading your KYC status...</p>
        </div>
      </div>
    );
  }

  const submittedDate = kycData?.submittedAt
    ? new Date(kycData.submittedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const submittedTime = kycData?.submittedAt
    ? new Date(kycData.submittedAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  // Dynamic preview helper values
  const getFrontLabel = () => {
    if (kycData?.documentType === 'PASSPORT') return 'Passport Info Page';
    if (kycData?.documentType === 'DRIVING_LICENSE') return "Driver's License Front";
    return 'National ID Front';
  };

  const getBackLabel = () => {
    if (kycData?.documentType === 'PASSPORT') return 'Passport Cover';
    if (kycData?.documentType === 'DRIVING_LICENSE') return "Driver's License Back";
    return 'National ID Back';
  };

  // If passport and back page is same as front, do not render duplicate back card
  const showBackCard =
    kycData?.documentType !== 'PASSPORT' ||
    (kycData?.documentBack && kycData?.documentBack !== kycData?.documentFront);

  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#FF9C65] via-amber-400 to-[#FF9C65]" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Animated pending icon */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full bg-amber-200/40 animate-ping" style={{ animationDuration: '2s' }} />
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
              {/* Inner circle */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-200">
                <Clock size={28} className="text-white animate-pulse" />
              </div>
            </div>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-bold text-[var(--color-dark)] mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            KYC Under Review
          </h1>
          <p className="text-[var(--color-gray-500)] text-sm max-w-sm mx-auto leading-relaxed">
            Your identity verification is being reviewed by our team. This usually takes 1-2 business days.
          </p>
        </div>

        {/* Status Timeline Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[var(--shadow-card)] mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h3 className="text-sm font-bold text-[var(--color-dark)] mb-5 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
            <Shield size={16} className="text-[#E57432]" />
            Verification Progress
          </h3>

          <div className="space-y-0">
            {/* Step 1 - Submitted */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <div className="w-0.5 h-8 bg-emerald-200" />
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold text-[var(--color-dark)]">Application Submitted</p>
                <p className="text-xs text-[var(--color-gray-400)] mt-0.5">
                  {submittedDate} {submittedTime ? `at ${submittedTime}` : ''}
                </p>
              </div>
            </div>

            {/* Step 2 - Under Review */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                </div>
                <div className="w-0.5 h-8 bg-gray-200" />
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold text-amber-600">Under Review</p>
                <p className="text-xs text-[var(--color-gray-400)] mt-0.5">
                  Our team is verifying your documents
                </p>
              </div>
            </div>

            {/* Step 3 - Decision */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-300" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-gray-400)]">Verification Decision</p>
                <p className="text-xs text-[var(--color-gray-300)] mt-0.5">
                  Pending
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Documents Card */}
        {kycData && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[var(--shadow-card)] mb-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-sm font-bold text-[var(--color-dark)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <FileText size={16} className="text-[#E57432]" />
              Submitted Documents
            </h3>

            {/* Document Type badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-100">
                <CreditCard size={14} className="text-[#E57432]" />
                <span className="text-xs font-semibold text-[#E57432]">
                  {DOCUMENT_TYPE_LABELS[kycData.documentType] || kycData.documentType}
                </span>
              </div>
              {submittedDate && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-gray-400)]">
                  <Calendar size={12} />
                  {submittedDate}
                </div>
              )}
            </div>

            {/* Document previews */}
            <div className={`grid gap-3 ${showBackCard ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <DocumentPreview
                label={getFrontLabel()}
                url={kycData.documentFront}
                onClick={() => setActivePreview({ label: getFrontLabel(), url: kycData.documentFront })}
              />
              {showBackCard && (
                <DocumentPreview
                  label={getBackLabel()}
                  url={kycData.documentBack}
                  onClick={() => setActivePreview({ label: getBackLabel(), url: kycData.documentBack })}
                />
              )}
              <DocumentPreview
                label="Selfie Photo"
                url={kycData.selfieUrl}
                onClick={() => setActivePreview({ label: 'Selfie Photo', url: kycData.selfieUrl })}
              />
            </div>

            {/* Notes */}
            {kycData.notes && (
              <div className="mt-5 p-4 rounded-xl bg-[var(--color-gray-100)] border border-[var(--color-gray-200)]">
                <p className="text-xs font-bold text-[var(--color-gray-500)] mb-1 uppercase tracking-wider">Application Notes</p>
                <p className="text-sm text-[var(--color-dark)] leading-relaxed">{kycData.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Refresh button */}
        <button
          type="button"
          onClick={() => refetch()}
          className="w-full py-3.5 rounded-xl border-2 border-[var(--color-gray-200)] bg-white text-[var(--color-dark)] font-semibold text-sm transition-all duration-200 hover:border-[#E57432] hover:bg-orange-50 cursor-pointer flex items-center justify-center gap-2 animate-fade-in-up"
          style={{ animationDelay: '300ms' }}
        >
          <RefreshCw size={16} className="animate-spin-slow" />
          Check Status Again
        </button>

        {/* Help text */}
        <p className="text-center text-xs text-[var(--color-gray-400)] mt-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          Need help? Contact our support team at{' '}
          <a href="mailto:support@pardnabook.com" className="text-[#E57432] font-medium hover:underline no-underline">
            support@pardnabook.com
          </a>
        </p>
      </div>

      {/* Lightbox / Zoom Overlay */}
      {activePreview && (
        <div
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm p-4 cursor-pointer animate-fade-in"
          onClick={() => setActivePreview(null)}
        >
          <div className="relative max-w-3xl max-h-[80vh] w-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActivePreview(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-sm font-semibold"
            >
              <X size={18} /> Close
            </button>
            <img
              src={activePreview.url}
              alt={activePreview.label}
              className="max-w-full max-h-[70vh] rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <p className="text-white font-semibold mt-4 text-sm tracking-wider uppercase bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
              {activePreview.label}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Document Preview Component ── */
function DocumentPreview({
  label,
  url,
  onClick,
}: {
  label: string;
  url: string;
  onClick: () => void;
}) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <p className="text-xs font-semibold text-[var(--color-gray-400)] mb-1.5 truncate group-hover:text-[#E57432] transition-colors">
        {label}
      </p>
      <div className="relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3] shadow-sm group-hover:border-[#E57432] group-hover:shadow transition-all duration-200">
        <img
          src={url}
          alt={`${label} document`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle magnifying glass overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-semibold bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
            Click to zoom
          </span>
        </div>
      </div>
    </div>
  );
}
