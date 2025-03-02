"use client"  // Indicates that this file is client-side code in Next.js, enabling hooks like useState and useEffect

import * as React from "react"  // Importing React to use JSX and React features
import { ChevronLeft, ChevronRight } from "lucide-react"  // Importing left and right chevron icons for navigation
import { DayPicker } from "react-day-picker"  // Importing DayPicker component to render a calendar

import { cn } from "@/lib/utils"  // Utility function to conditionally apply class names
import { buttonVariants } from "@/components/ui/button"  // Importing button variants for consistent button styling

// Define CalendarProps to type-check the props for the Calendar component, extending DayPicker's props
export type CalendarProps = React.ComponentProps<typeof DayPicker>

// Calendar component definition
function Calendar({
  className,
  classNames,
  showOutsideDays = true,  // Default value for showOutsideDays is true, determines whether to show days outside the current month
  ...props  // Collecting the rest of the props to pass to the DayPicker component
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}  // Passes showOutsideDays to the DayPicker component to control visibility of outside days
      className={cn("p-3", className)}  // Combines custom className with default padding style
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",  // Defines the layout of months (stacked or side-by-side)
        month: "space-y-4",  // Adds space between months
        caption: "flex justify-center pt-1 relative items-center",  // Styles for the caption area (month/year label)
        caption_label: "text-sm font-medium",  // Styling for the caption label (e.g., month label)
        nav: "space-x-1 flex items-center",  // Defines navigation button layout
        nav_button: cn(  // Combines styles for navigation buttons with buttonVariants outline styling
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",  // Positions the previous button on the left
        nav_button_next: "absolute right-1",  // Positions the next button on the right
        table: "w-full border-collapse space-y-1",  // Table layout for the calendar grid
        head_row: "flex",  // Flex layout for the header row (days of the week)
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",  // Styling for header cells (days of the week)
        row: "flex w-full mt-2",  // Flex layout for calendar rows (weeks)
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",  // Styling for each day cell with special handling for selected and range days
        day: cn(  // Combines styles for day cells with buttonVariants ghost styling
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",  // Style for the last day in a selected range
        day_selected:  // Styling for a selected day (primary color, hover effects)
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",  // Styling for today's date
        day_outside:  // Styling for days outside the current month
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",  // Styling for disabled days (e.g., days from another month)
        day_range_middle:  // Styling for the middle days in a selected range
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",  // Hides certain days
        ...classNames,  // Merge any custom class names passed via props
      }}
      components={{
        IconLeft: ({ className, ...props }) => (  // Custom left chevron icon for navigation
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (  // Custom right chevron icon for navigation
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}  // Spread the remaining props onto the DayPicker component
    />
  )
}

Calendar.displayName = "Calendar"  // Set a display name for debugging purposes in React DevTools

export { Calendar }  // Export the Calendar component for use in other parts of the application
