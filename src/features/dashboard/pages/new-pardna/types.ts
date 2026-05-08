export interface NewPardnaFormData {
  /* Step 1 – Basics */
  name: string;
  description: string;
  contributionAmount: string;
  frequency: 'Weekly' | 'Fortnightly' | 'Monthly' | '';
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
  phone: string;
}

export const STEP_LABELS = ['Basics', 'Rules', 'Participants', 'Payout', 'Summary', 'Done'] as const;
export type StepIndex = 0 | 1 | 2 | 3 | 4 | 5;

/* Demo data for auto-fill */
export const DEMO_FORM: NewPardnaFormData = {
  name: 'Family Monthly',
  description: 'Monthly savings circle for the extended family',
  contributionAmount: '200',
  frequency: 'Monthly',
  startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  numberOfParticipants: '3',
  payoutOrder: 'Fixed order',
  rulesNotes: '48h grace period for late payments. Payout on the last Friday of each round. Banker covers shortfalls.',
  participants: [
    { id: 1, name: 'Sarah Johnson', phone: '07700 900001' },
    { id: 2, name: 'Marcus Williams', phone: '07700 900002' },
    { id: 3, name: 'Aisha Patel', phone: '07700 900003' },
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
    { id: 1, name: '', phone: '' },
    { id: 2, name: '', phone: '' },
    { id: 3, name: '', phone: '' },
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
