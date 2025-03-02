"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Define interface for DatePicker props
interface DatePickerProps {
  onDateChange: (date: Date | undefined) => void; // Callback function to handle date selection
}

export function DatePicker({ onDateChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date>() // State to manage the selected date

  // Trigger onDateChange whenever the date state updates
  React.useEffect(() => {
    onDateChange(date);
  }, [date, onDateChange]);

  return (
    <Popover>
      {/* Button that triggers the date picker */}
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground" // Apply muted style when no date is selected
          )}
        >
          {/* Calendar icon next to the date display */}
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>} {/* Show selected date or placeholder text */}
        </Button>
      </PopoverTrigger>
      
      {/* Popover content containing the calendar component */}
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single" // Single date selection mode
          selected={date} // Pass selected date to the calendar
          onSelect={setDate} // Update state when a date is selected
          initialFocus // Auto-focus on calendar when opened
        />
      </PopoverContent>
    </Popover>
  )
}
