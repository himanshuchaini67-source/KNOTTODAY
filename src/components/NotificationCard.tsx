import { CheckCircle2, Info, AlertCircle, Clock, X } from 'lucide-react';
import type { AppNotification } from '@/types';

interface NotificationCardProps {
  notification: AppNotification;
  onMarkRead?: (id: string) => void;
}

const typeConfig = {
  success: { Icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-100' },
  info: { Icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-100' },
  warning: { Icon: AlertCircle, color: 'text-champagne-700', bg: 'bg-champagne-50', ring: 'ring-champagne-200' },
  reminder: { Icon: Clock, color: 'text-burgundy-600', bg: 'bg-burgundy-50', ring: 'ring-burgundy-100' },
};

export function NotificationCard({ notification, onMarkRead }: NotificationCardProps) {
  const { Icon, color, bg, ring } = typeConfig[notification.type];

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-burgundy-50 bg-white p-4 transition-shadow hover:shadow-sm ${
        !notification.read ? 'ring-1 ring-burgundy-50' : ''
      }`}
    >
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${bg} ${ring} ring-1`}>
        <Icon className={`h-4.5 w-4.5 ${color}`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-burgundy-900">{notification.title}</p>
            <p className="mt-0.5 text-sm text-charcoal/60">{notification.message}</p>
          </div>
          {!notification.read && (
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-burgundy-500" />
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-charcoal/40">{notification.time}</p>
          {onMarkRead && !notification.read && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="text-xs font-medium text-burgundy-600 hover:text-burgundy-800"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
