export interface NewPardnaFormData {
  /* Step 1 – Basics */
  name: string;
  description: string;
  contributionAmount: string;
  frequency: 'Daily' | 'Weekly' | 'Fortnightly' | 'Monthly' | 'Quarterly' | 'Yearly' | '';
  startDate: string;
  numberOfParticipants: string;

  /* Step 2 – Rules */
  payoutOrder: 'Fixed order' | 'Random draw' | '';
  rulesNotes: string;

  /* Step 3 – Participants */
  participants: ParticipantEntry[];
  confirmed: boolean;
}

export interface ParticipantEntry {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export const STEP_LABELS = ['Basics', 'Rules', 'Participants', 'Payout', 'Summary', 'Done'] as const;
export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

/* Demo data for auto-fill */
export const DEMO_FORM: NewPardnaFormData = {
  name: 'Weekend Trip Fund',
  description: 'Monthly savings group for our summer beach trip',
  contributionAmount: '800',
  frequency: 'Weekly',
  startDate: '2026-05-01',
  numberOfParticipants: '5',
  payoutOrder: 'Fixed order',
  rulesNotes: 'Everyone contributes every Friday. Payout rotates weekly.',
  participants: [
    { id: 1, name: 'Alice Wonderland', email: 'alice@example.com', phone: '+15551234567' },
    { id: 2, name: 'Bob Marley', email: 'bob@example.com', phone: '+15557654321' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', phone: '+15559876543' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', phone: '+15554433221' },
    { id: 5, name: 'Diana Prince', email: 'diana@example.com', phone: '+15554433221' },
  ],
  confirmed: true,
};

export const INITIAL_FORM: NewPardnaFormData = {
  name: '',
  description: '',
  contributionAmount: '',
  frequency: '',
  startDate: '',
  numberOfParticipants: '3',
  payoutOrder: '',
  rulesNotes: '',
  participants: [
    { id: 1, name: '', email: '', phone: '' },
    { id: 2, name: '', email: '', phone: '' },
    { id: 3, name: '', email: '', phone: '' },
  ],
  confirmed: false,
};

/* Example contacts for the contact search dropdown */
export const EXAMPLE_CONTACTS = [
  { name: 'Grace Miller', phone: '07700 900001', trust: 'Strong', score: 92 },
  { name: 'Kwame Boateng', phone: '07700 900002', trust: 'Strong', score: 88 },
  { name: 'Ama Osei', phone: '07700 900003', trust: 'Strong', score: 85 },
  { name: 'Patrick Laryea', phone: '07700 900004', trust: 'Fair', score: 76 },
  { name: 'Ruth Nkrumah', phone: '07700 900005', trust: 'Fair', score: 72 },
  { name: 'David Koffi', phone: '07700 900006', trust: 'Fair', score: 68 },
  { name: 'Abena Mensah', phone: '07700 900007', trust: 'Developing', score: 58 },
  { name: 'Samuel Darko', phone: '07700 900008', trust: 'Weak', score: 42 },
];
