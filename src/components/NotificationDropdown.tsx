
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, AlertTriangle, Clock, CreditCard } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationDropdown = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'trial_warning':
      case 'trial_expired':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'subscription_expired':
        return <CreditCard className="h-4 w-4 text-red-500" />;
      case 'access_denied':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationStyle = (type: string, read: boolean) => {
    const baseStyle = `p-3 rounded-lg border cursor-pointer transition-colors`;
    
    if (read) {
      return `${baseStyle} bg-gray-50 border-gray-200`;
    }
    
    switch (type) {
      case 'trial_expired':
      case 'access_denied':
        return `${baseStyle} bg-red-50 border-red-200 hover:bg-red-100`;
      case 'trial_warning':
        return `${baseStyle} bg-orange-50 border-orange-200 hover:bg-orange-100`;
      case 'subscription_expired':
        return `${baseStyle} bg-yellow-50 border-yellow-200 hover:bg-yellow-100`;
      default:
        return `${baseStyle} bg-blue-50 border-blue-200 hover:bg-blue-100`;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notificações</h4>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Nenhuma notificação
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={getNotificationStyle(notification.type, notification.read)}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={markAllAsRead}
              >
                Marcar todas como lidas
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
