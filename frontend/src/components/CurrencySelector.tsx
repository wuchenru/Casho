import React, { useState, useEffect } from 'react';

const DEFAULT_CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CNY', name: 'Chinese Yuan' },
];

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
}

// This component is designed to be used with a global CurrencyContext for currency and exchange rate management.
// Pass the selected currency code to the parent via onChange, and let the parent handle context update.
const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange }) => {
  const [search, setSearch] = useState('');
  const [currencies, setCurrencies] = useState(DEFAULT_CURRENCIES);
  const [allCurrencies, setAllCurrencies] = useState(DEFAULT_CURRENCIES);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // 拉取所有币种列表（仅一次）
    fetch('https://api.exchangerate.host/symbols')
      .then(res => res.json())
      .then(data => {
        if (data.symbols) {
          const arr = Object.entries(data.symbols).map(([code, info]: any) => ({ code, name: info.description }));
          setAllCurrencies(arr);
        }
      });
  }, []);

  useEffect(() => {
    if (!search) {
      setCurrencies(DEFAULT_CURRENCIES);
    } else {
      const filtered = allCurrencies.filter(c =>
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase())
      );
      setCurrencies([
        ...DEFAULT_CURRENCIES,
        ...filtered.filter(c => !DEFAULT_CURRENCIES.some(d => d.code === c.code)),
      ]);
    }
  }, [search, allCurrencies]);

  return (
    <div className="relative w-56">
      <button
        className="w-full px-4 py-2 border rounded bg-white text-left shadow"
        onClick={() => setShowDropdown(v => !v)}
        type="button"
      >
        {value} <span className="text-gray-400">▼</span>
      </button>
      {showDropdown && (
        <div className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-auto">
          <input
            className="w-full px-3 py-2 border-b outline-none"
            placeholder="Search currency..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <ul>
            {currencies.map(c => (
              <li
                key={c.code}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${c.code === value ? 'bg-gray-200 font-bold' : ''}`}
                onClick={() => {
                  onChange(c.code);
                  setShowDropdown(false);
                  setSearch('');
                }}
              >
                {c.code} - {c.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CurrencySelector; 