import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Notification, { NotificationPosition } from './Notification';

export interface NotificationItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface NotificationContainerProps {
  notifications: NotificationItem[];
  position: NotificationPosition;
  onClose: (id: string) => void;
}

function NotificationContainer({ notifications, position, onClose }: NotificationContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div className={`fixed z-50 ${positionClasses[position]} flex flex-col gap-3 w-full max-w-sm pointer-events-none`}>
      <AnimatePresence mode="sync">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <Notification
              {...notification}
              position={position}
              onClose={onClose}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default NotificationContainer; 