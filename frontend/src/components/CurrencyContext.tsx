import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currency: string;
  rates: Record<string, number>;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const DEFAULT_CURRENCY = 'USD';
const SUPPORTED_CURRENCIES = ['USD', 'CAD', 'CNY'];

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [rates, setRates] = useState<Record<string, number>>({ USD: 1 });

  // 拉取汇率
  useEffect(() => {
    fetch(`https://api.exchangerate.host/latest?base=USD`)
      .then(res => res.json())
      .then(data => {
        if (data.rates) {
          setRates(data.rates);
        }
      });
  }, []);

  // 切换币种时可扩展为重新拉取汇率（如需更高精度）

  return (
    <CurrencyContext.Provider value={{ currency, rates, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}; 