export interface GuideStep {
  num: number;
  label: string;
  title: string;
  desc: string;
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    num: 1,
    label: 'STEP 01',
    title: 'Set it up',
    desc: 'Tap "+ New Pardna" on your dashboard. Give your pardna a clear name (for example, "Family Monthly"), set the amount each person pays, choose how often you collect, and pick a start date. Then set who gets paid first, second, third, and so on.',
  },
  {
    num: 2,
    label: 'STEP 02',
    title: 'Add your people',
    desc: 'Add people from your contacts or type their names manually. Share the invite link so everyone can see the amount, dates, and payout order. Clear info from day one helps avoid confusion later.',
  },
  {
    num: 3,
    label: 'STEP 03',
    title: 'Collect each round',
    desc: 'On collection day, open the pardna and tap "Record payment" as each person pays. Anyone who has not paid yet is clearly marked, so nothing is missed. Money can still be handled your usual way: cash, transfer, or any method your group uses.',
  },
  {
    num: 4,
    label: 'STEP 04',
    title: 'Pay out the pot',
    desc: 'When the round is complete, tap "Mark as paid out" for the person whose turn it is. The next person moves up automatically and the new round starts. Repeat this each cycle.',
  },
  {
    num: 5,
    label: 'STEP 05',
    title: 'Keep going until everyone has had a turn',
    desc: 'Once everyone has received the pot once, your pardna is complete. Trust scores are updated based on payment behavior, your full history stays saved, and you can start a new pardna with the same group in one tap.',
  },
];

export const GUIDE_TIPS = [
  'Set clear rules on day one and write them down so everyone agrees.',
  'Do not ignore missed payments; flag them quickly before they become bigger issues.',
  'Use the participant diary to track who pays on time and who needs reminders.',
  'Invite people you trust, because pardna works best with reliable members.',
  'Confirm each payout with a message or note so you keep a clear record.',
];