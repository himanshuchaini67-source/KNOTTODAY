import { useState } from 'react';
import { CheckCheck, BellOff } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { PageHeader } from '@/components/PageHeader';
import { NotificationCard } from '@/components/NotificationCard';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/useToast';
import { notificationsData } from '@/data/mockData';

export function NotificationsPage() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  return (
    <Layout title={t('notifications')} subtitle={`${unreadCount} unread`}>
      <PageHeader
        title="Notifications"
        description="Stay updated on everything happening with your wedding"
        action={
          <button onClick={markAllRead} className="btn-secondary">
            <CheckCheck className="h-4 w-4" /> Mark All Read
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-burgundy-600 text-white' : 'border border-burgundy-100 bg-white text-charcoal/60 hover:bg-burgundy-50'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'unread' ? 'bg-burgundy-600 text-white' : 'border border-burgundy-100 bg-white text-charcoal/60 hover:bg-burgundy-50'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <NotificationCard key={n.id} notification={n} onMarkRead={markAsRead} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card flex flex-col items-center p-12 text-center">
          <BellOff className="mb-3 h-10 w-10 text-charcoal/20" />
          <p className="text-charcoal/50">No notifications to show.</p>
        </div>
      )}
    </Layout>
  );
}
