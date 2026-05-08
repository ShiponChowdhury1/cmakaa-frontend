import type { DiaryParticipant } from './types';

export const PARTICIPANTS: DiaryParticipant[] = [
  {
    id: 1, name: 'Abena M.', initials: 'AM', handle: 'abena_m@PardnaBook',
    trust: 91, rating: 'Excellent', overallPercent: 92,
    pay: 92, time: 90, post: 90, commit: 92,
    activeCount: 3, completedCount: 2, phone: '+44 7700 900006',
    behavioural: { paymentConsistency: 92, timeliness: 90, postPayoutBehaviour: 90, commitment: 92, completionRate: 88, groupStability: 85, trendDirection: 90 },
    timeline: [
      { id: 1, type: 'paid', title: 'Paid £200 on time', tags: [{ label: 'On Time', color: '#16A34A', bg: '#F0FDF4' }, { label: 'Family Monthly', color: '#E57432', bg: '#FFF7ED' }], date: '19 Apr 2025', trustChange: 2, trustScores: '74 → 76' },
      { id: 2, type: 'joined', title: 'Joined Wedding Pardna', tags: [{ label: 'Joined', color: '#1B2A4A', bg: '#EFF6FF' }, { label: 'Wedding Pardna', color: '#E57432', bg: '#FFF7ED' }], date: '1 Mar 2025', trustChange: 2, trustScores: '72 → 74' },
      { id: 3, type: 'payout', title: 'Received payout of £1,600', tags: [{ label: 'Payout', color: '#FFFFFF', bg: '#E57432' }, { label: 'Family Monthly', color: '#E57432', bg: '#FFF7ED' }, { label: 'Round 4', color: '#64748B', bg: '#F1F5F9' }], date: '18 Feb 2025', trustChange: 0, trustScores: '72 → 72' },
    ],
  },
  {
    id: 2, name: 'Ama O.', initials: 'AO', handle: 'ama_o@PardnaBook',
    trust: 90, rating: 'Excellent', overallPercent: 91,
    pay: 92, time: 88, post: 90, commit: 95,
    activeCount: 4, completedCount: 2, phone: '+44 7700 900004',
    behavioural: { paymentConsistency: 92, timeliness: 88, postPayoutBehaviour: 90, commitment: 95, completionRate: 90, groupStability: 88, trendDirection: 91 },
    timeline: [
      { id: 1, type: 'paid', title: 'Paid £200 on time', tags: [{ label: 'On Time', color: '#16A34A', bg: '#F0FDF4' }, { label: 'Family Monthly', color: '#E57432', bg: '#FFF7ED' }], date: '19 Apr 2025', trustChange: 2, trustScores: '88 → 90' },
      { id: 2, type: 'joined', title: 'Joined Market Traders', tags: [{ label: 'Joined', color: '#1B2A4A', bg: '#EFF6FF' }, { label: 'Market Traders', color: '#E57432', bg: '#FFF7ED' }], date: '5 Nov 2024', trustChange: 2, trustScores: '71 → 73' },
    ],
  },
  {
    id: 3, name: 'David K.', initials: 'DK', handle: 'david_k@PardnaBook',
    trust: 78, rating: 'Fair', overallPercent: 70,
    pay: 75, time: 70, post: 65, commit: 80,
    activeCount: 3, completedCount: 0, phone: '+44 7700 900003',
    behavioural: { paymentConsistency: 70, timeliness: 70, postPayoutBehaviour: 80, commitment: 90, completionRate: 80, groupStability: 70, trendDirection: 80 },
    timeline: [
      { id: 1, type: 'missed', title: 'Missed contribution deadline', tags: [{ label: 'Missed', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Market Traders', color: '#E57432', bg: '#FFF7ED' }, { label: 'Round 8', color: '#64748B', bg: '#F1F5F9' }], date: '21 Apr 2026', trustChange: -7, trustScores: '84 → 78' },
      { id: 2, type: 'missed', title: 'Missed contribution deadline', tags: [{ label: 'Missed', color: '#DC2626', bg: '#FEF2F2' }, { label: 'Wedding Pardna', color: '#E57432', bg: '#FFF7ED' }, { label: 'Round 3', color: '#64748B', bg: '#F1F5F9' }], date: '27 Mar 2026', trustChange: -7, trustScores: '86 → 79' },
      { id: 3, type: 'paid', title: 'Paid £200 on time', tags: [{ label: 'On Time', color: '#16A34A', bg: '#F0FDF4' }, { label: 'Family Monthly', color: '#E57432', bg: '#FFF7ED' }, { label: 'Round 8', color: '#64748B', bg: '#F1F5F9' }], date: '19 Apr 2025', trustChange: 2, trustScores: '76 → 78' },
      { id: 4, type: 'joined', title: 'Joined Wedding Pardna', tags: [{ label: 'Joined', color: '#1B2A4A', bg: '#EFF6FF' }, { label: 'Wedding Pardna', color: '#E57432', bg: '#FFF7ED' }], date: '1 Mar 2025', trustChange: 2, trustScores: '74 → 76' },
      { id: 5, type: 'payout', title: 'Received payout of £1,600', tags: [{ label: 'Payout', color: '#FFFFFF', bg: '#E57432' }, { label: 'Family Monthly', color: '#E57432', bg: '#FFF7ED' }, { label: 'Round 4', color: '#64748B', bg: '#F1F5F9' }], date: '18 Feb 2025', trustChange: 0, trustScores: '74 → 74' },
      { id: 6, type: 'joined', title: 'Joined Family Monthly', tags: [{ label: 'Joined', color: '#1B2A4A', bg: '#EFF6FF' }, { label: 'Family Monthly', color: '#E57432', bg: '#FFF7ED' }], date: '20 Nov 2024', trustChange: 2, trustScores: '70 → 72' },
      { id: 7, type: 'joined', title: 'Joined Market Traders', tags: [{ label: 'Joined', color: '#1B2A4A', bg: '#EFF6FF' }, { label: 'Market Traders', color: '#E57432', bg: '#FFF7ED' }], date: '5 Nov 2024', trustChange: 2, trustScores: '71 → 73' },
    ],
  },
  {
    id: 4, name: 'Esi K.', initials: 'EK', handle: 'esi_k@PardnaBook',
    trust: 83, rating: 'Good', overallPercent: 83,
    pay: 84, time: 80, post: 82, commit: 84,
    activeCount: 3, completedCount: 2, phone: '+44 7700 900007',
    behavioural: { paymentConsistency: 84, timeliness: 80, postPayoutBehaviour: 82, commitment: 84, completionRate: 80, groupStability: 78, trendDirection: 83 },
    timeline: [
      { id: 1, type: 'paid', title: 'Paid £200 on time', tags: [{ label: 'On Time', color: '#16A34A', bg: '#F0FDF4' }, { label: 'Family Monthly', color: '#E57432', bg: '#FFF7ED' }], date: '19 Apr 2025', trustChange: 2, trustScores: '81 → 83' },
      { id: 2, type: 'joined', title: 'Joined Sisters Circle', tags: [{ label: 'Joined', color: '#1B2A4A', bg: '#EFF6FF' }, { label: 'Sisters Circle', color: '#E57432', bg: '#FFF7ED' }], date: '15 Jan 2025', trustChange: 2, trustScores: '79 → 81' },
    ],
  },
  {
    id: 5, name: 'Grace M.', initials: 'GM', handle: 'grace_m@PardnaBook',
    trust: 95, rating: 'Excellent', overallPercent: 95,
    pay: 96, time: 94, post: 95, commit: 96,
    activeCount: 5, completedCount: 3, phone: '+44 7700 900001',
    behavioural: { paymentConsistency: 96, timeliness: 94, postPayoutBehaviour: 95, commitment: 96, completionRate: 93, groupStability: 92, trendDirection: 95 },
    timeline: [
      { id: 1, type: 'paid', title: 'Paid £200 on time', tags: [{ label: 'On Time', color: '#16A34A', bg: '#F0FDF4' }, { label: 'Family Monthly', color: '#E57432', bg: '#FFF7ED' }], date: '19 Apr 2025', trustChange: 1, trustScores: '94 → 95' },
    ],
  },
  {
    id: 6, name: 'Kwame B.', initials: 'KB', handle: 'kwame_b@PardnaBook',
    trust: 85, rating: 'Good', overallPercent: 85,
    pay: 86, time: 84, post: 83, commit: 88,
    activeCount: 3, completedCount: 1, phone: '+44 7700 900005',
    behavioural: { paymentConsistency: 86, timeliness: 84, postPayoutBehaviour: 83, commitment: 88, completionRate: 82, groupStability: 80, trendDirection: 85 },
    timeline: [
      { id: 1, type: 'paid', title: 'Paid £300 on time', tags: [{ label: 'On Time', color: '#16A34A', bg: '#F0FDF4' }, { label: 'Market Traders', color: '#E57432', bg: '#FFF7ED' }], date: '15 Apr 2025', trustChange: 2, trustScores: '83 → 85' },
    ],
  },
  {
    id: 7, name: 'Michael T.', initials: 'MT', handle: 'michael_t@PardnaBook',
    trust: 88, rating: 'Good', overallPercent: 88,
    pay: 90, time: 86, post: 87, commit: 89,
    activeCount: 4, completedCount: 2, phone: '+44 7700 900002',
    behavioural: { paymentConsistency: 90, timeliness: 86, postPayoutBehaviour: 87, commitment: 89, completionRate: 85, groupStability: 84, trendDirection: 88 },
    timeline: [
      { id: 1, type: 'paid', title: 'Paid £200 on time', tags: [{ label: 'On Time', color: '#16A34A', bg: '#F0FDF4' }, { label: 'Family Monthly', color: '#E57432', bg: '#FFF7ED' }], date: '17 Apr 2025', trustChange: 2, trustScores: '86 → 88' },
    ],
  },
];
