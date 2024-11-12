import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ArrowRight } from 'lucide-react';
import { useNotification } from '../../../contexts/NotificationContext';
import type { NotificationPosition } from '../../ui/Notification';

const positions: { value: NotificationPosition; label: string; description: string }[] = [
  { 
    value: 'top-left', 
    label: 'Top Left',
    description: 'Notifications appear in the top left corner'
  },
  { 
    value: 'top-right', 
    label: 'Top Right',
    description: 'Notifications appear in the top right corner'
  },
  { 
    value: 'bottom-left', 
    label: 'Bottom Left',
    description: 'Notifications appear in the bottom left corner'
  },
  { 
    value: 'bottom-right', 
    label: 'Bottom Right',
    description: 'Notifications appear in the bottom right corner'
  },
];

const testNotifications = [
  { type: 'success', message: 'This is a success notification' },
  { type: 'error', message: 'This is an error notification' },
  { type: 'info', message: 'This is an info notification' },
  { type: 'warning', message: 'This is a warning notification' },
] as const;

function NotificationSection() {
  const { position, setPosition, showNotification } = useNotification();

  const handlePositionChange = (newPosition: NotificationPosition) => {
    setPosition(newPosition);
    showNotification('success', `Notification position updated to ${newPosition}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-textPrimary">Notifications</h3>
        <p className="text-sm text-textSecondary">Configure notification settings</p>
      </div>

      {/* Position Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-textPrimary">Position</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {positions.map(({ value, label, description }) => (
            <motion.button
              key={value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePositionChange(value)}
              className={`flex items-center p-4 rounded-lg border transition-all ${
                position === value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border text-textSecondary hover:border-primary hover:text-primary hover:bg-primary/5'
              }`}
            >
              <div className="flex-1">
                <p className="font-medium">{label}</p>
                <p className="text-sm opacity-80">{description}</p>
              </div>
              {position === value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Test Notifications */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-textPrimary">Test Notifications</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {testNotifications.map(({ type, message }) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => showNotification(type, message)}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary group transition-all"
            >
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-3 text-textSecondary group-hover:text-primary transition-colors" />
                <span className="text-textPrimary group-hover:text-primary transition-colors">
                  Test {type} notification
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-textSecondary group-hover:text-primary transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NotificationSection; 