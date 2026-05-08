export interface DiaryParticipant {
  id: number;
  name: string;
  initials: string;
  handle: string;
  trust: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  overallPercent: number;
  pay: number;
  time: number;
  post: number;
  commit: number;
  activeCount: number;
  completedCount: number;
  phone?: string;
  behavioural: {
    paymentConsistency: number;
    timeliness: number;
    postPayoutBehaviour: number;
    commitment: number;
    completionRate: number;
    groupStability: number;
    trendDirection: number;
  };
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: number;
  type: 'missed' | 'paid' | 'joined' | 'payout';
  title: string;
  tags: { label: string; color: string; bg: string }[];
  date: string;
  trustChange: number;
  trustScores: string;
}
