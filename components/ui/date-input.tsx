/**
Prologue:
Name of Program: components/ui/date-input.tsx
Description: Provides DateInput JSX Component.
Inputs: None
Outputs: Exports DateInput JSX component for picking dates
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 03/09/2025
 */

// Import React, and useEffect and useRef hook
import React, { useEffect, useRef } from 'react'

// Define the DateInputProps type
interface DateInputProps {
  value?: Date // Type date
  onChange: (date: Date) => void // Callback on date change
}

// Define the DateParts type
interface DateParts {
  day: number   // day of a date
  month: number // month of a date
  year: number  // year of a date
}

// Name: DateInput
// Author: Vinayak Jha
// Date: 03/09/2025
// Preconditions: date value, and onChange callback
// Postconditions: JSX Component to show the chart
const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  // Initialize the date
  const [date, setDate] = React.useState<DateParts>(() => {
    // If value is given, initialize the date from it. Otherwise, default to current
    const d = value ? new Date(value) : new Date()
    return {
      day: d.getDate(),
      month: d.getMonth() + 1, // JavaScript months are 0-indexed
      year: d.getFullYear()
    }
  })

  // Initialize the month ref
  const monthRef = useRef<HTMLInputElement | null>(null);
  // Initialize the day ref
  const dayRef = useRef<HTMLInputElement | null>(null);
  // Initialize the year ref
  const yearRef = useRef<HTMLInputElement | null>(null)

  // Define the useEffect
  useEffect(() => {
    // If the value is given, initialize the date from it. Otherwise, default to current
    const d = value ? new Date(value) : new Date();
    setDate({
      day: d.getDate(),
      month: d.getMonth() + 1, // JavaScript months are 0-indexed
      year: d.getFullYear()
    });
    // Re-run the effect whenver the value changes
  }, [value])

  // Function to validate the date
  const validateDate = (field: keyof DateParts, value: number): boolean => {
    if (
      // If the day is less than 1 or greater than 31, the value is invalid
      (field === 'day' && (value < 1 || value > 31)) ||
      // If the month is less than 1 or greather than 12, the value is invalid
      (field === 'month' && (value < 1 || value > 12)) ||
      // If the year is less than 1000, and greater than 9999, value is invalid
      (field === 'year' && (value < 1000 || value > 9999))
    ) {
      return false
    }

    // Validate the day of the month
    const newDate = { ...date, [field]: value }
    const d = new Date(newDate.year, newDate.month - 1, newDate.day)
    return d.getFullYear() === newDate.year &&
      d.getMonth() + 1 === newDate.month &&
      d.getDate() === newDate.day
  }

  // Function to handle inpit change
  const handleInputChange =
    (field: keyof DateParts) => (e: React.ChangeEvent<HTMLInputElement>) => {
      // If the event's target.value is defined, convert to number, otherwise use empty string
      const newValue = e.target.value ? Number(e.target.value) : '';
      // Run the validateDate if the newValue is a number
      const isValid = typeof newValue === 'number' && validateDate(field, newValue)

      // If the new value is valid, update the date
      const newDate = { ...date, [field]: newValue };

      // Set the new Date
      setDate(newDate)

      // only call onChange when the entry is valid
      if (isValid) {
        onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
      }
    }

  // Initialize the initialDate ref
  const initialDate = useRef<DateParts>(date)

  // Function to handleBlur
  const handleBlur = (field: keyof DateParts) => (
    e: React.FocusEvent<HTMLInputElement>
  ): void => {
    // If the value happens to be undefined, use the initialDate
    if (!e.target.value) {
      setDate(initialDate.current)
      return
    }

    // Get the new Value
    const newValue = Number(e.target.value);
    // Check if the newValue is a valid date
    const isValid = validateDate(field, newValue)

    // If the value is not valid, use the initial date
    if (!isValid) {
      setDate(initialDate.current)
    } else {
      // If the new value is valid, update the initial value
      initialDate.current = { ...date, [field]: newValue }
    }
  }

  // Function to handle key down
  const handleKeyDown =
    (field: keyof DateParts) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow command (or control) combinations
      if (e.metaKey || e.ctrlKey) {
        return
      }

      // Prevent non-numeric characters, excluding allowed keys
      if (
        !/^[0-9]$/.test(e.key) &&
        ![
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'Delete',
          'Tab',
          'Backspace',
          'Enter'
        ].includes(e.key)
      ) {
        e.preventDefault()
        return
      }

      // Handle ArrowUp event
      if (e.key === 'ArrowUp') {
        // Prevent default event handler
        e.preventDefault();
        // Make a copy of the date
        let newDate = { ...date }

        // Handle the case where field is day
        if (field === 'day') {
          if (date[field] === new Date(date.year, date.month, 0).getDate()) {
            newDate = { ...newDate, day: 1, month: (date.month % 12) + 1 }
            if (newDate.month === 1) newDate.year += 1
          } else {
            newDate.day += 1
          }
        }

        // Handle the case where field is month
        if (field === 'month') {
          if (date[field] === 12) {
            newDate = { ...newDate, month: 1, year: date.year + 1 }
          } else {
            newDate.month += 1
          }
        }

        // Handle the case where field is year
        if (field === 'year') {
          newDate.year += 1
        }

        // Set the date
        setDate(newDate)
        // Call the onChange callback
        onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
      } else if (e.key === 'ArrowDown') {
        // Handle the ArrowDown event
        e.preventDefault();

        // Copy the date
        let newDate = { ...date }

        // Handle the case where day is field
        if (field === 'day') {
          if (date[field] === 1) {
            newDate.month -= 1
            if (newDate.month === 0) {
              newDate.month = 12
              newDate.year -= 1
            }
            newDate.day = new Date(newDate.year, newDate.month, 0).getDate()
          } else {
            newDate.day -= 1
          }
        }

        // Handle the case where month is field
        if (field === 'month') {
          if (date[field] === 1) {
            newDate = { ...newDate, month: 12, year: date.year - 1 }
          } else {
            newDate.month -= 1
          }
        }

        // Handle the case where year is field
        if (field === 'year') {
          newDate.year -= 1
        }

        // Set the date
        setDate(newDate);
        // Call the onChange callback
        onChange(new Date(newDate.year, newDate.month - 1, newDate.day))
      }

      // Handle the ArrowRight event
      if (e.key === 'ArrowRight') {
        if (
          e.currentTarget.selectionStart === e.currentTarget.value.length ||
          (e.currentTarget.selectionStart === 0 &&
            e.currentTarget.selectionEnd === e.currentTarget.value.length)
        ) {
          // Prevent the default event
          e.preventDefault()
          if (field === 'month') dayRef.current?.focus()
          if (field === 'day') yearRef.current?.focus()
        }
      } else if (e.key === 'ArrowLeft') {
        // Handle the ArrowLeft event
        if (
          e.currentTarget.selectionStart === 0 ||
          (e.currentTarget.selectionStart === 0 &&
            e.currentTarget.selectionEnd === e.currentTarget.value.length)
        ) {
          // Prevent the default event
          e.preventDefault()
          if (field === 'day') monthRef.current?.focus()
          if (field === 'year') dayRef.current?.focus()
        }
      }
    }

  return (
    <div className="flex border rounded-lg items-center text-sm px-1">
      <input
        type="text"
        ref={monthRef}
        max={12}
        maxLength={2}
        value={date.month.toString()}
        onChange={handleInputChange('month')}
        onKeyDown={handleKeyDown('month')}
        onFocus={(e) => {
          // If the innerWidth is greater than 1024, trigger the selection
          if (window.innerWidth > 1024) {
            e.target.select()
          }
        }}
        onBlur={handleBlur('month')}
        className="p-0 outline-none w-6 border-none text-center"
        placeholder="M"
      />
      <span className="opacity-20 -mx-px">/</span>
      <input
        type="text"
        ref={dayRef}
        max={31}
        maxLength={2}
        value={date.day.toString()}
        onChange={handleInputChange('day')}
        onKeyDown={handleKeyDown('day')}
        onFocus={(e) => {
          // If the innerWidth is greater than 1024, trigger the selection
          if (window.innerWidth > 1024) {
            e.target.select()
          }
        }}
        onBlur={handleBlur('day')}
        className="p-0 outline-none w-7 border-none text-center"
        placeholder="D"
      />
      <span className="opacity-20 -mx-px">/</span>
      <input
        type="text"
        ref={yearRef}
        max={9999}
        maxLength={4}
        value={date.year.toString()}
        onChange={handleInputChange('year')}
        onKeyDown={handleKeyDown('year')}
        onFocus={(e) => {
          // If the innerWidth is greater than 1024, trigger the selection
          if (window.innerWidth > 1024) {
            e.target.select()
          }
        }}
        onBlur={handleBlur('year')}
        className="p-0 outline-none w-12 border-none text-center"
        placeholder="YYYY"
      />
    </div>
  )
}

DateInput.displayName = 'DateInput'

// Export the DateInput component
export { DateInput }