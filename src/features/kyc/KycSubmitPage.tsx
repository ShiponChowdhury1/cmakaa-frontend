import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Upload, X, FileText, Camera, CreditCard, ChevronDown, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useSubmitKycMutation, useGetMyKycQuery } from '@/store/features/kyc/kycApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser } from '@/store/features/auth/authSlice';
import type { KycDocumentType } from '@/store/features/kyc/kycApi.types';

const DOCUMENT_TYPES: { value: KycDocumentType; label: string; icon: React.ReactNode }[] = [
  { value: 'NID', label: 'National ID Card', icon: <CreditCard size={18} /> },
  { value: 'PASSPORT', label: 'Passport', icon: <FileText size={18} /> },
  { value: 'DRIVING_LICENSE', label: 'Driving License', icon: <CreditCard size={18} /> },
];

interface FileUploadState {
  file: File | null;
  preview: string | null;
}

export default function KycSubmitPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [submitKyc, { isLoading }] = useSubmitKycMutation();
  const { data: kycResponse } = useGetMyKycQuery();
  const kycData = kycResponse?.data;

  // Form state
  const [documentType, setDocumentType] = useState<KycDocumentType>('NID');
  const [notes, setNotes] = useState('');
  const [documentFront, setDocumentFront] = useState<FileUploadState>({ file: null, preview: null });
  const [documentBack, setDocumentBack] = useState<FileUploadState>({ file: null, preview: null });
  const [selfie, setSelfie] = useState<FileUploadState>({ file: null, preview: null });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  // File input refs
  const frontRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const isRejected = user?.kycStatus === 'REJECTED' || kycData?.status === 'REJECTED';
  const rejectionReason = kycData?.rejectionReason;

  const handleFileChange = useCallback(
    (setter: React.Dispatch<React.SetStateAction<FileUploadState>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
          setApiError('Only JPG and PNG files are allowed');
          return;
        }
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setApiError('File size must be less than 5MB');
          return;
        }

        const preview = URL.createObjectURL(file);
        setter({ file, preview });
        setApiError('');
      },
    [],
  );

  const removeFile = useCallback(
    (setter: React.Dispatch<React.SetStateAction<FileUploadState>>, ref: React.RefObject<HTMLInputElement | null>) => () => {
      setter({ file: null, preview: null });
      if (ref.current) ref.current.value = '';
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    // Validate
    if (!documentFront.file) {
      setApiError('Please upload the front of your document');
      return;
    }
    if (!documentBack.file) {
      setApiError('Please upload the back of your document');
      return;
    }
    if (!selfie.file) {
      setApiError('Please upload a selfie photo');
      return;
    }
    if (!notes.trim()) {
      setApiError('Please add a note for your application');
      return;
    }

    try {
      await submitKyc({
        documentType,
        notes: notes.trim(),
        documentFront: documentFront.file,
        documentBack: documentBack.file,
        selfieUrl: selfie.file,
      }).unwrap();

      // Update user kycStatus in Redux
      if (user) {
        dispatch(setUser({ ...user, kycStatus: 'PENDING' }));
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/kyc/pending', { replace: true });
      }, 2000);
    } catch (err: unknown) {
      const apiErr = err as { data?: { message?: string }; message?: string };
      setApiError(apiErr?.data?.message || apiErr?.message || 'Failed to submit KYC application');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#FFF8F3] flex items-center justify-center px-4">
        <div className="text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h2
            className="text-2xl font-bold text-[var(--color-dark)] mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            KYC Submitted Successfully!
          </h2>
          <p className="text-[var(--color-gray-500)] text-sm">
            Redirecting to pending page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-[#FF9C65] via-[#E57432] to-[#FF9C65]" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF9C65] to-[#E57432] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200">
            <Shield size={28} className="text-white" />
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-[var(--color-dark)] mb-2"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isRejected ? 'Resubmit Your KYC' : 'Verify Your Identity'}
          </h1>
          <p className="text-[var(--color-gray-500)] text-sm max-w-md mx-auto">
            {isRejected
              ? 'Your previous application was rejected. Please review the reason below and resubmit with corrected documents.'
              : 'Complete KYC verification to start using PardnaBook. This helps us keep your savings secure.'}
          </p>
        </div>

        {/* Rejection reason banner */}
        {isRejected && rejectionReason && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700 mb-1">Application Rejected</p>
              <p className="text-sm text-red-600">{rejectionReason}</p>
            </div>
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in flex items-center gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            {apiError}
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF9C65] to-[#E57432] flex items-center justify-center text-white text-xs font-bold">1</div>
              <span className="text-sm font-semibold text-[var(--color-dark)]">Document Details</span>
            </div>
            <div className="flex-1 h-px bg-[var(--color-gray-200)]" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF9C65] to-[#E57432] flex items-center justify-center text-white text-xs font-bold">2</div>
              <span className="text-sm font-semibold text-[var(--color-dark)]">Upload Documents</span>
            </div>
          </div>

          {/* Document Type & Notes */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-bold text-[var(--color-dark)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <FileText size={18} className="text-[#E57432]" />
              Document Information
            </h3>

            {/* Document Type Select */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-[var(--color-dark)] mb-2">
                Document Type
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-4 py-3.5 rounded-xl border border-[var(--color-gray-200)] bg-white text-left flex items-center justify-between transition-all duration-200 hover:border-[var(--color-gray-300)] focus:border-[#E57432] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#E57432]">
                      {DOCUMENT_TYPES.find(d => d.value === documentType)?.icon}
                    </div>
                    <span className="text-sm font-medium text-[var(--color-dark)]">
                      {DOCUMENT_TYPES.find(d => d.value === documentType)?.label}
                    </span>
                  </div>
                  <ChevronDown size={18} className={`text-[var(--color-gray-400)] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-xl border border-gray-100 shadow-[var(--shadow-lg)] overflow-hidden animate-fade-in">
                    {DOCUMENT_TYPES.map((dt) => (
                      <button
                        key={dt.value}
                        type="button"
                        onClick={() => {
                          setDocumentType(dt.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left cursor-pointer border-none ${
                          documentType === dt.value
                            ? 'bg-orange-50 text-[#E57432]'
                            : 'bg-white text-[var(--color-dark)] hover:bg-[var(--color-gray-100)]'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          documentType === dt.value ? 'bg-orange-100 text-[#E57432]' : 'bg-gray-50 text-[var(--color-gray-400)]'
                        }`}>
                          {dt.icon}
                        </div>
                        <span className="text-sm font-medium">{dt.label}</span>
                        {documentType === dt.value && (
                          <CheckCircle2 size={16} className="ml-auto text-[#E57432]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="kyc-notes" className="block text-sm font-semibold text-[var(--color-dark)] mb-2">
                Notes
              </label>
              <textarea
                id="kyc-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your application..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-gray-200)] bg-white text-[var(--color-dark)] placeholder:text-[var(--color-gray-400)] text-sm transition-all duration-200 focus:outline-none focus:border-[#E57432] hover:border-[var(--color-gray-300)] resize-none"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[var(--shadow-card)]">
            <h3 className="text-base font-bold text-[var(--color-dark)] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
              <Camera size={18} className="text-[#E57432]" />
              Upload Documents
            </h3>
            <p className="text-xs text-[var(--color-gray-400)] mb-5">
              Accepted formats: JPG, PNG • Max size: 5MB per file
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Document Front */}
              <FileUploadCard
                label="Document Front"
                file={documentFront}
                inputRef={frontRef}
                onFileChange={handleFileChange(setDocumentFront)}
                onRemove={removeFile(setDocumentFront, frontRef)}
                onClick={() => frontRef.current?.click()}
              />

              {/* Document Back */}
              <FileUploadCard
                label="Document Back"
                file={documentBack}
                inputRef={backRef}
                onFileChange={handleFileChange(setDocumentBack)}
                onRemove={removeFile(setDocumentBack, backRef)}
                onClick={() => backRef.current?.click()}
              />

              {/* Selfie */}
              <FileUploadCard
                label="Selfie Photo"
                file={selfie}
                inputRef={selfieRef}
                onFileChange={handleFileChange(setSelfie)}
                onRemove={removeFile(setSelfie, selfieRef)}
                onClick={() => selfieRef.current?.click()}
                isSelfie
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF9C65] to-[#E57432] text-white font-semibold text-base transition-all duration-300 hover:shadow-lg hover:shadow-orange-300/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer border-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Shield size={20} />
                {isRejected ? 'Resubmit KYC Application' : 'Submit KYC Application'}
              </>
            )}
          </button>

          {/* Security notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--color-gray-400)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Your documents are encrypted and securely stored
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── File Upload Card Component ── */
interface FileUploadCardProps {
  label: string;
  file: FileUploadState;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onClick: () => void;
  isSelfie?: boolean;
}

function FileUploadCard({ label, file, inputRef, onFileChange, onRemove, onClick, isSelfie }: FileUploadCardProps) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-[var(--color-gray-500)] mb-2">
        {label}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        onChange={onFileChange}
        className="hidden"
      />

      {file.preview ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-[#E57432]/30 bg-orange-50 aspect-[4/3]">
          <img
            src={file.preview}
            alt={label}
            className="w-full h-full object-cover"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              type="button"
              onClick={onRemove}
              className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-white transition-colors cursor-pointer border-none shadow-md"
            >
              <X size={16} />
            </button>
          </div>
          {/* Success badge */}
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
            <CheckCircle2 size={14} className="text-white" />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-[var(--color-gray-200)] bg-[var(--color-gray-100)]/50 flex flex-col items-center justify-center gap-2 transition-all duration-200 hover:border-[#E57432] hover:bg-orange-50/50 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            {isSelfie ? (
              <Camera size={18} className="text-[var(--color-gray-400)] group-hover:text-[#E57432] transition-colors" />
            ) : (
              <Upload size={18} className="text-[var(--color-gray-400)] group-hover:text-[#E57432] transition-colors" />
            )}
          </div>
          <span className="text-xs font-medium text-[var(--color-gray-400)] group-hover:text-[#E57432] transition-colors">
            Click to upload
          </span>
        </button>
      )}
    </div>
  );
}
