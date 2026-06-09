import { useState } from 'react';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} from '@/store/features/notifications/notificationsApi';
import {
  Bell,
  Trash2,
  CheckCheck,
  AlertCircle,
  Lock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  Info
} from 'lucide-react';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const { data: response, isLoading, error } = useGetNotificationsQuery({
    page,
    limit: 10,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  const notifications = response?.data || [];
  const pagination = response?.pagination;

  // Filter notifications locally based on active tab
  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const handleMarkAsRead = async (id: string, isAlreadyRead: boolean) => {
    if (isAlreadyRead) return;
    try {
      await markAsRead(id).unwrap();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to mark notification as read');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
      toast.success('Notification deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete notification');
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Are you sure you want to delete all notifications?')) {
      try {
        await deleteAllNotifications().unwrap();
        toast.success('All notifications cleared');
        setPage(1);
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to clear notifications');
      }
    }
  };

  const handleMarkAllRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.isRead);
    if (unreadNotifications.length === 0) return;
    
    try {
      // Mark all visible unread notifications as read
      await Promise.all(unreadNotifications.map((n) => markAsRead(n.id).unwrap()));
      toast.success('All notifications marked as read');
    } catch (err: any) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('password') || lower.includes('security') || lower.includes('reset')) {
      return <Lock className="w-5 h-5 text-amber-500" />;
    }
    if (lower.includes('changed') || lower.includes('success') || lower.includes('done')) {
      return <Sparkles className="w-5 h-5 text-emerald-500" />;
    }
    if (lower.includes('created') || lower.includes('pardna')) {
      return <Sparkles className="w-5 h-5 text-orange-500" />;
    }
    return <Bell className="w-5 h-5 text-blue-500" />;
  };

  const getIconBg = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('password') || lower.includes('security') || lower.includes('reset')) {
      return 'bg-amber-50';
    }
    if (lower.includes('changed') || lower.includes('success') || lower.includes('done')) {
      return 'bg-emerald-50';
    }
    if (lower.includes('created') || lower.includes('pardna')) {
      return 'bg-orange-50';
    }
    return 'bg-blue-50';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-200 border-t-[#E57432] animate-spin" />
        <p className="text-gray-500 font-medium">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 text-center px-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-500 font-semibold text-lg">Failed to load notifications</p>
        <p className="text-gray-500 text-sm max-w-sm">Please check your connection and try again.</p>
      </div>
    );
  }

  const totalUnread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 animate-fade-in pb-24 max-w-3xl mx-auto">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-dark)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Notifications
          </h1>
          <p className="text-xs text-gray-400 mt-1">Stay updated on your Pardna activities, payments, and system alerts.</p>
        </div>

        {/* Global actions */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {totalUnread > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer shadow-sm"
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={handleDeleteAll}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-50 border border-red-100 text-red-600 hover:bg-red-100/70 transition-all cursor-pointer shadow-sm"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Filters ─────────────────────────────────── */}
      <div className="flex gap-2 border-b border-gray-100 pb-px">
        {(['all', 'unread', 'read'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className="px-4 py-2.5 text-sm font-semibold capitalize cursor-pointer transition-all border-b-2 -mb-px flex items-center gap-1.5"
            style={{
              borderColor: filter === t ? '#E57432' : 'transparent',
              color: filter === t ? '#E57432' : '#64748B',
            }}
          >
            <span className="capitalize">{t}</span>
            {t === 'unread' && totalUnread > 0 && (
              <span className="text-[10px] font-bold bg-[#E57432] text-white rounded-full px-1.5 py-0.5 min-w-[16px] text-center">
                {totalUnread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Notification Items ──────────────────────── */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-500 shadow-sm">
            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="font-semibold text-gray-700">No notifications found</p>
            <p className="text-xs text-gray-400 mt-1">
              You are all caught up! There are no {filter !== 'all' ? filter : ''} notifications.
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n.id, n.isRead)}
              className={`group bg-white border rounded-2xl p-4 shadow-sm transition-all relative overflow-hidden flex gap-4 ${
                n.isRead 
                  ? 'border-gray-100 opacity-80' 
                  : 'border-orange-100/70 hover:border-orange-200 cursor-pointer bg-gradient-to-r from-orange-50/20 to-transparent'
              }`}
            >
              {/* Unread Indicator Bar */}
              {!n.isRead && (
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#E57432]" />
              )}

              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getIconBg(n.title)}`}>
                {getIcon(n.title)}
              </div>

              {/* Text details */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[var(--color-dark)] leading-snug">
                    {n.title}
                  </h3>
                  {!n.isRead && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E57432] shrink-0" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {n.message}
                </p>
                <p className="text-[10px] text-gray-400 mt-2 font-medium">
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </div>

              {/* Action area */}
              <div className="flex flex-col justify-between items-end gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n.id);
                  }}
                  className="p-1.5 rounded-lg border border-gray-100 hover:border-red-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                {!n.isRead && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(n.id, n.isRead);
                    }}
                    className="p-1.5 rounded-lg border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ──────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 px-2">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{(page - 1) * 10 + 1}</span> to{' '}
            <span className="font-semibold text-gray-700">
              {Math.min(page * 10, pagination.total)}
            </span>{' '}
            of <span className="font-semibold text-gray-700">{pagination.total}</span> notifications
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, idx) => idx + 1).map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className="w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer border"
                style={{
                  background: page === pNum ? '#E57432' : 'white',
                  borderColor: page === pNum ? '#E57432' : '#E2E8F0',
                  color: page === pNum ? 'white' : '#475569',
                }}
              >
                {pNum}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
