export type ParticipantStatus = 'paid' | 'pending' | 'late' | 'missed';

export interface Participant {
  id: number;
  name: string;
  initials: string;
  trust: number;
  amount: number;
  date?: string;
  status: ParticipantStatus;
}

export interface PardnaGroup {
  id: number;
  name: string;
  roundLabel: string;
  amountPerPerson: number;
  paidCount: number;
  totalCount: number;
  participants: Participant[];
}

export interface PaymentStats {
  paid: number;
  pending: number;
  late: number;
  missed: number;
}
