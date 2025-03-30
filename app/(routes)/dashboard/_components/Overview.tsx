"use client";

// Import necessary dependencies
import React from 'react';
import { DateRangePicker } from '@/components/ui/date-range-picker'; // Importing a custom date range picker component
import { toast } from 'sonner'; // Importing toast notifications for displaying messages
import { differenceInDays } from 'date-fns'; // Importing utility function to calculate date differences

// Define the maximum allowed date range in days
const MAX_DATE_RANGE_DAYS = 30; 

// Define the prop types for the Overview component
interface OverviewProps {
  dateRange: { from: Date; to: Date }; // Object containing 'from' and 'to' dates
  setDateRange: React.Dispatch<React.SetStateAction<{ from: Date; to: Date }>>; // Function to update date range state
}

// Functional component that displays an overview with a date range picker
const Overview: React.FC<OverviewProps> = ({ dateRange, setDateRange }) => {
  return (
    <div className="px-10 mb-5"> {/* Container with padding and margin */}
      <div className="flex flex-col md:flex-row md:items-center justify-between"> {/* Responsive layout */}
        <h2 className="font-bold text-2xl">Overview</h2> {/* Section title */}
        <div className="mt-4 md:mt-0"> {/* Responsive spacing for date picker */}
          <DateRangePicker
            initialDateFrom={dateRange.from} // Set initial 'from' date from state
            initialDateTo={dateRange.to} // Set initial 'to' date from state
            showCompare={false} // Disable compare feature (if available in DateRangePicker)
            onUpdate={values => {
              const { from, to } = values.range; // Extract selected date range
              if (!from || !to) return; // Ensure both dates are selected before proceeding
              
              // Check if selected date range exceeds the maximum allowed days
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(`The selected date range is too big. Max allowed date range is ${MAX_DATE_RANGE_DAYS} days.`);
                return;
              }
              
              // Update date range state with valid selection
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Overview; // Export the component for use in other parts of the application
