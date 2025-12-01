"use client";
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

// Mock exchange rates - in production, you'd fetch from an API
const exchangeRates = {
  USD: { AED: 3.67, INR: 83.12, SAR: 3.75, EUR: 0.85, GBP: 0.79 },
  AED: { USD: 0.27, INR: 22.64, SAR: 1.02, EUR: 0.23, GBP: 0.21 },
  INR: { USD: 0.012, AED: 0.044, SAR: 0.045, EUR: 0.010, GBP: 0.009 },
  SAR: { USD: 0.27, AED: 0.98, INR: 22.17, EUR: 0.23, GBP: 0.21 },
  EUR: { USD: 1.18, AED: 4.33, INR: 98.05, SAR: 4.42, GBP: 0.93 },
  GBP: { USD: 1.27, AED: 4.66, INR: 105.53, SAR: 4.76, EUR: 1.08 }
};

// Create context first
const CurrencyContext = React.createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('AED');
  const [rates, setRates] = useState(exchangeRates);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      if (process.env.NODE_ENV === 'production') {
        setLoading(true);
        try {
          // Option 1: Free API (exchangerate-api.com)
          const response = await fetch('https://api.exchangerate-api.com/v4/latest/AED');
          const data = await response.json();
          
          // Convert to our format
          const productionRates = {
            AED: data.rates,
            USD: {}, // Would need separate calls for each base currency
            // Or use a paid API that supports multiple base currencies
          };
          
          setRates(productionRates);
        } catch (error) {
          console.error('Failed to fetch exchange rates:', error);
          // Fallback to mock rates
        }
        setLoading(false);
      }
    };
    
    fetchRates();
    // Refresh rates every hour
    const interval = setInterval(fetchRates, 3600000);
    return () => clearInterval(interval);
  }, []);

  const convertPrice = (amount, fromCurrency = 'AED') => {
    if (selectedCurrency === fromCurrency) {
      return amount;
    }
    
    const rate = rates[fromCurrency]?.[selectedCurrency] || 1;
    return Math.round(amount * rate * 100) / 100;
  };

  const formatPrice = (amount, fromCurrency = 'AED') => {
    const convertedAmount = convertPrice(amount, fromCurrency);
    const currency = currencies.find(c => c.code === selectedCurrency);
    return `${currency.code} ${convertedAmount}`;
  };

  return (
    <CurrencyContext.Provider value={{
      selectedCurrency,
      setSelectedCurrency,
      convertPrice,
      formatPrice,
      currencies
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = React.useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencySelector = () => {
  const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();
  
  return (
    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
      <SelectTrigger className="w-32 border-slate-200 bg-white text-slate-700">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white border-slate-200 shadow-lg">
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code} className="text-slate-700 hover:bg-slate-100 focus:bg-slate-100">
            {currency.symbol} {currency.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};