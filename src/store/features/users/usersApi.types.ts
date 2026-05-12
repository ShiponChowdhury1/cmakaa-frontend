/* ── User Types ── */

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'banker' | 'participant';
  avatar?: string;
  kycStatus?: string;
  createdAt?: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface SingleUserResponse {
  success: boolean;
  data: User;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}
