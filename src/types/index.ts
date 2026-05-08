/* ── Shared Types ── */

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'banker' | 'participant';
  avatar?: string;
}

export interface Pardna {
  id: string;
  name: string;
  banker: string;
  participantCount: number;
  status: 'active' | 'completed' | 'overdue' | 'paused';
  totalCollected: number;
  currency: string;
  createdAt: string;
}

export interface KycApplication {
  id: string;
  userId: string;
  userName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  documents: string[];
}

export interface ActivityLog {
  id: string;
  type: 'payment' | 'status' | 'admin' | 'recycle';
  title: string;
  description: string;
  time: string;
}

export interface StatsData {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: 'up' | 'down';
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
