export interface CreateParticipantRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  payoutOrder: number;
}

export interface CreatePardnaRequest {
  name: string;
  description: string;
  notes: string;
  contribution: number;
  frequency: 'DAILY' | 'WEEKLY' | 'FORTNIGHTLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  startDate: string;
  totalRounds: number;
  participants: CreateParticipantRequest[];
}

export interface TrustScore {
  paymentConsistency: number;
  timeliness: number;
  commitment: number;
  complianceRate: number;
  groupStability: number;
  thirdDirection: number;
  compositeScore: number;
  label: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  payoutOrder: number;
  status: string;
  joinedAt: string;
  trustScore: TrustScore;
}

export interface PaymentParticipant {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Payment {
  id: string;
  amount: string;
  status: string;
  paidAt: string | null;
  notes: string | null;
  participant: PaymentParticipant;
}

export interface Payout {
  id: string;
  amount: string;
  status: string;
  confirmedAt: string | null;
  notes: string | null;
  confirmedBy: string | null;
}

export interface PayoutTo {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface Round {
  id: string;
  roundNumber: number;
  collectionDate: string;
  payoutDate: string;
  status: string;
  payoutTo: PayoutTo;
  payments: Payment[];
  payouts: Payout[];
}

export interface Pardna {
  id: string;
  bankerId: string;
  name: string;
  description: string;
  notes: string;
  contribution: string;
  frequency: string;
  startDate: string;
  status: string;
  totalRounds: number;
  currentRound: number;
  createdAt: string;
  participants: Participant[];
  rounds: Round[];
}

export interface GetPardnasResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Pardna[];
}

export interface CreatePardnaResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Pardna;
}
