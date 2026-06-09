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

