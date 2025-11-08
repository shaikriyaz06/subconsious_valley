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
  INR: { USD: 0.012, AED: 0.044, SAR: 0.045, EUR: 0.010, GBP: 0.009 }
};

// Create context first
const CurrencyContext = React.createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const convertPrice = (amount, fromCurrency = 'USD') => {
    if (selectedCurrency === fromCurrency) {
      return amount;
    }
    
    const rate = exchangeRates[fromCurrency]?.[selectedCurrency] || 1;
    return Math.round(amount * rate * 100) / 100;
  };

  const formatPrice = (amount, fromCurrency = 'USD') => {
    const convertedAmount = convertPrice(amount, fromCurrency);
    const currency = currencies.find(c => c.code === selectedCurrency);
    return `${currency.symbol}${convertedAmount}`;
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