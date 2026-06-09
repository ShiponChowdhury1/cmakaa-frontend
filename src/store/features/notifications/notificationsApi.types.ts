export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
  userId: string;
  jobId: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetNotificationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  pagination: PaginationInfo;
  data: Notification[];
}

export interface NotificationActionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Notification;
}
