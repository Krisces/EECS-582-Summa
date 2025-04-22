/**
 * Prologue
 * Name: DateRangeContext Component
 *
 * Description:
 * This component defines a context for managing a global date range using the useContext and useState hooks.
 * It includes a provider component and a custom hook to access and update the date range, which persists to localStorage.
 *
 * Author: Kristin Boeckmann, Lisa Phan, Vinayak Jha, Zach Alwin, Shravya Matta
 *
 * Date created: 04/12/2025
 *
 * Preconditions:
 * - Must be rendered client-side (uses localStorage).
 *
 * Acceptable input values:
 * - Valid Date objects for from and to in the DateRange.
 *
 * Unacceptable input values:
 * - Non-Date objects or invalid date strings will result in failed parsing.
 *
 * Postconditions:
 * - A DateRangeContext is available to descendant components.
 * - Date range values are accessible and persistent in localStorage.
 *
 * Return values:
 * - useDateRange() returns the current dateRange and a setGlobalDateRange function.
 *
 * Error and exception conditions:
 * - If localStorage contains malformed data, parsing may fail silently.
 *
 * Side effects: N/A
 *
 * Invariants:
 * - The from date is always before or equal to the to date
 *
 * Known faults: N/A
 */


"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { startOfMonth } from 'date-fns'; // Imports a helper function to get the start of the current month

interface DateRange {
  from: Date;
  to: Date;
}

interface DateRangeContextType {
  dateRange: DateRange; // The current global date range state
  setGlobalDateRange: (range: DateRange) => void;
}

// Creates a context with default values
const DateRangeContext = createContext<DateRangeContextType>({
  dateRange: { from: startOfMonth(new Date()), to: new Date() },
  setGlobalDateRange: () => {}, // Placeholder no-op function
});

// Context provider component that wraps parts of the app needing access to the date range.
export const DateRangeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  // Load dateRange from localStorage on client
  useEffect(() => {
    const storedDateRange = localStorage.getItem('dateRange'); // Retrieves from localStorage
    if (storedDateRange) {
      const parsed = JSON.parse(storedDateRange, (key, value) => {
        if (key === 'from' || key === 'to') {
          return new Date(value); // Converts string values back to Date objects
        }
        return value;
      });
      setDateRange(parsed); // Set the loaded range into state
    }
  }, []);

  // Save dateRange to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dateRange', JSON.stringify(dateRange));
  }, [dateRange]); // Only runs when `dateRange` changes


  const setGlobalDateRange = (range: DateRange) => {
    setDateRange(range); // Updates state, which also triggers localStorage save
  };

  return (
    <DateRangeContext.Provider value={{ dateRange, setGlobalDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
};

export const useDateRange = () => useContext(DateRangeContext);
