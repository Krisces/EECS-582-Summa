"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { startOfMonth } from 'date-fns';

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeContextType {
  dateRange: DateRange;
  setGlobalDateRange: (range: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeContextType>({
  dateRange: { from: startOfMonth(new Date()), to: new Date() },
  setGlobalDateRange: () => {},
});

export const DateRangeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  // Load dateRange from localStorage on client
  useEffect(() => {
    const storedDateRange = localStorage.getItem('dateRange');
    if (storedDateRange) {
      const parsed = JSON.parse(storedDateRange, (key, value) => {
        if (key === 'from' || key === 'to') {
          return new Date(value);
        }
        return value;
      });
      setDateRange(parsed);
    }
  }, []);

  // Save dateRange to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dateRange', JSON.stringify(dateRange));
  }, [dateRange]);

  const setGlobalDateRange = (range: DateRange) => {
    setDateRange(range);
  };

  return (
    <DateRangeContext.Provider value={{ dateRange, setGlobalDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => useContext(DateRangeContext);
