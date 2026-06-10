/* ── KYC API Types ── */

/** KYC document types supported by the backend */
export type KycDocumentType = 'NID' | 'PASSPORT' | 'DRIVING_LICENSE';

/** KYC application statuses */
export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

/** Full KYC application response from GET /kyc */
export interface KycApplication {
  id: string;
  userId: string;
  documentType: KycDocumentType;
  documentFront: string;
  documentBack: string;
  selfieUrl: string;
  status: KycStatus;
  rejectionReason: string | null;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string;
}

/** Request payload for POST /kyc/apply (sent as multipart/form-data) */
export interface SubmitKycRequest {
  documentType: KycDocumentType;
  notes: string;
  documentFront: File;
  documentBack: File;
  selfieUrl: File;
}

/** Generic API response wrapper (reused from auth) */
export interface KycApiResponse<T = null> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
