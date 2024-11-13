import { useState, useEffect } from 'react';
import { settingsOperations } from '../utils/db/settings';

export function useSettings() {
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedCurrency = await settingsOperations.getCurrency();
        setCurrency(savedCurrency);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return {
    currency,
    formatCurrency,
    isLoading
  };
} 