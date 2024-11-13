import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, DollarSign } from 'lucide-react';
import { settingsOperations } from '../../../utils/db/settings';
import { useNotification } from '../../../contexts/NotificationContext';
import currencyCodes from 'currency-codes';
import { countries } from 'countries-list';
import { zonedTimeToUtc } from 'date-fns-tz';
import Select from '../../ui/Select';

// Get all available timezones
const timezones = Intl.supportedValuesOf('timeZone');

// Get all currencies with additional info
const currencies = currencyCodes.data.map(currency => ({
  code: currency.code,
  name: currency.currency,
  symbol: currency.symbol || currency.code,
  countries: currency.countries?.[0] ? countries[currency.countries[0]]?.name || currency.countries[0] : undefined
}));

function LocalizationSection() {
  const [timezone, setTimezone] = useState('');
  const [currency, setCurrency] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [savedTimezone, savedCurrency] = await Promise.all([
          settingsOperations.getTimezone(),
          settingsOperations.getCurrency()
        ]);
        setTimezone(savedTimezone);
        setCurrency(savedCurrency);
      } catch (error) {
        console.error('Error loading localization settings:', error);
        showNotification('error', 'Failed to load localization settings');
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
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

  const handleCurrencyChange = async (newCurrency: string) => {
    try {
      await settingsOperations.setCurrency(newCurrency);
      setCurrency(newCurrency);
      showNotification('success', 'Currency updated successfully');
    } catch (error) {
      console.error('Error updating currency:', error);
      showNotification('error', 'Failed to update currency');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const timezoneOptions = timezones.map(tz => ({
    value: tz,
    label: tz.replace(/_/g, ' '),
  }));

  const currencyOptions = currencies.map(cur => ({
    value: cur.code,
    label: cur.code,
    description: `${cur.name} (${cur.symbol})${cur.countries ? ` - ${cur.countries}` : ''}`
  }));

  if (isLoading) {
    return <div className="text-textSecondary">Loading localization settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-textPrimary">Localization</h3>
        <p className="text-sm text-textSecondary">Configure your regional preferences</p>
      </div>

      <div className="space-y-6">
        {/* Timezone Settings */}
        <div className="space-y-4">
          <Select
            id="timezone"
            label="Timezone"
            value={timezone}
            onChange={handleTimezoneChange}
            options={timezoneOptions}
            icon={Globe}
            placeholder="Select timezone"
          />
          <p className="mt-2 text-sm text-textSecondary">
            Current time: {new Date().toLocaleTimeString(undefined, { timeZone: timezone })}
          </p>
        </div>

        {/* Currency Settings */}
        <div className="space-y-4">
          <Select
            id="currency"
            label="Currency"
            value={currency}
            onChange={handleCurrencyChange}
            options={currencyOptions}
            icon={DollarSign}
            placeholder="Select currency"
          />
        </div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-surface rounded-lg border border-border"
        >
          <h4 className="text-sm font-medium text-textPrimary mb-4">Preview</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-textSecondary mb-1">Date & Time:</p>
              <p className="text-textPrimary">
                {new Date().toLocaleDateString(undefined, { 
                  timeZone: timezone,
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-textSecondary mb-1">Currency Format:</p>
              <div className="space-y-1">
                <p className="text-textPrimary">{formatCurrency(1234.56)}</p>
                <p className="text-textPrimary">{formatCurrency(9999999.99)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LocalizationSection;