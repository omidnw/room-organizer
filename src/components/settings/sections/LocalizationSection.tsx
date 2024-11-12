import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { settingsOperations } from '../../../utils/db/settings';
import { useNotification } from '../../../contexts/NotificationContext';

// Get all available timezones
const timezones = Intl.supportedValuesOf('timeZone');

function LocalizationSection() {
  const [timezone, setTimezone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const loadTimezone = async () => {
      try {
        const savedTimezone = await settingsOperations.getTimezone();
        setTimezone(savedTimezone);
      } catch (error) {
        console.error('Error loading timezone:', error);
        showNotification('error', 'Failed to load timezone settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadTimezone();
  }, [showNotification]);

  const handleTimezoneChange = async (newTimezone: string) => {
    try {
      await settingsOperations.setTimezone(newTimezone);
      setTimezone(newTimezone);
      showNotification('success', 'Timezone updated successfully');
    } catch (error) {
      console.error('Error updating timezone:', error);
      showNotification('error', 'Failed to update timezone');
    }
  };

  if (isLoading) {
    return <div className="text-textSecondary">Loading timezone settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-textPrimary">Localization</h3>
        <p className="text-sm text-textSecondary">Configure your timezone preferences</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-textPrimary mb-2">
            Timezone
          </label>
          <div className="flex items-center space-x-4">
            <Globe className="w-5 h-5 text-textSecondary" />
            <select
              id="timezone"
              value={timezone}
              onChange={(e) => handleTimezoneChange(e.target.value)}
              className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-textPrimary focus:outline-none focus:border-primary transition-colors"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-2 text-sm text-textSecondary">
            Current time: {new Date().toLocaleTimeString(undefined, { timeZone: timezone })}
          </p>
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-surface rounded-lg border border-border"
        >
          <h4 className="text-sm font-medium text-textPrimary mb-2">Preview</h4>
          <div className="space-y-2">
            <p className="text-sm text-textSecondary">
              Date: {new Date().toLocaleDateString(undefined, { timeZone: timezone })}
            </p>
            <p className="text-sm text-textSecondary">
              Time: {new Date().toLocaleTimeString(undefined, { timeZone: timezone })}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LocalizationSection;