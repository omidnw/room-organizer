import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface NotificationProps {
  id: string;
  type: NotificationType;
  message: string;
  position: NotificationPosition;
  onClose: (id: string) => void;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: {
    background: 'var(--color-success)',
    text: '#FFFFFF',
    icon: '#FFFFFF',
    border: 'var(--color-success)',
  },
  error: {
    background: 'var(--color-error)',
    text: '#FFFFFF',
    icon: '#FFFFFF',
    border: 'var(--color-error)',
  },
  info: {
    background: 'var(--color-primary)',
    text: '#FFFFFF',
    icon: '#FFFFFF',
    border: 'var(--color-primary)',
  },
  warning: {
    background: 'var(--color-warning)',
    text: '#FFFFFF',
    icon: '#FFFFFF',
    border: 'var(--color-warning)',
  },
};

function Notification({ id, type, message, position, onClose, duration = 5000 }: NotificationProps) {
  const Icon = icons[type];
  const style = styles[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: position.includes('top') ? -20 : 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center w-full max-w-sm rounded-lg shadow-lg overflow-hidden"
      style={{ 
        backgroundColor: style.background,
        border: `1px solid ${style.border}`,
      }}
    >
      <div className="flex-1 flex items-center p-4">
        <Icon 
          className="w-5 h-5 flex-shrink-0 mr-3" 
          style={{ color: style.icon }} 
        />
        <p className="text-sm font-medium" style={{ color: style.text }}>
          {message}
        </p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="p-2 hover:bg-black/10 transition-colors"
        style={{ color: style.icon }}
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  );
}

export default Notification; 