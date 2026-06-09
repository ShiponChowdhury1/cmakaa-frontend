import { baseApi } from '../../api/baseApi';
import type {
  GetNotificationsResponse,
  NotificationActionResponse,
} from './notificationsApi.types';

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ── GET all notifications ── */
    getNotifications: builder.query<GetNotificationsResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/notifications',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['Notifications'],
    }),

    /* ── MARK single notification as read ── */
    markNotificationAsRead: builder.mutation<NotificationActionResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notifications'],
    }),

    /* ── DELETE single notification ── */
    deleteNotification: builder.mutation<NotificationActionResponse, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),

    /* ── DELETE all notifications ── */
    deleteAllNotifications: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/notifications',
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationsApi;
