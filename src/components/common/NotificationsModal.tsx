import React from 'react';
import {
  Bell,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  HeartHandshake,
  Sparkles,
  X
} from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onMarkOneRead: (id: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onMarkOneRead
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'meeting':
        return <Calendar className="w-4 h-4 text-sky-600" />;
      case 'animator':
        return <HeartHandshake className="w-4 h-4 text-amber-600" />;
      case 'service':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'attendance':
      case 'deadline':
      default:
        return <Clock className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-start justify-center p-4 pt-16">
      <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-sky-100 text-sky-800 font-semibold px-1.5 py-0.5 rounded">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-sky-700 hover:text-sky-900 font-medium"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 text-sm font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 text-xs">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">No notifications at this time.</div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkOneRead(n.id)}
                className={`p-3 rounded transition-colors cursor-pointer flex items-start gap-3 ${
                  n.read ? 'hover:bg-slate-50' : 'bg-sky-50/50 hover:bg-sky-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs ${
                        n.read ? 'text-slate-800 font-medium' : 'text-slate-900 font-bold'
                      }`}
                    >
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
