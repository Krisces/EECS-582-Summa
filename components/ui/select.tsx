"use client"

/* 
 * Prologue
 * 
 * Name: Select Component
 * 
 * Description: 
 * This code defines a custom Select component using Radix UI's Select primitives,
 * enhancing the basic functionality with additional customization. It provides 
 * functionality for creating dropdown lists with selected items.
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Vinayak Jha, Zach Alwin, Shravya Matta
 * Date Created: 03/09/2025
 * Date Last Revised: N/A
 *
 * Revisions: N/A
 *
 * Preconditions:
 *    - Requires `@radix-ui/react-select` and `lucide-react` libraries to be installed.
 *
 * Acceptable Input:
 *    - `className` prop allows for customization of the dropdown appearance.
 *
 * Unacceptable Input:
 *    - Invalid or unsupported JSX elements passed as children.
 *    - Non-string values for the `className` prop.
 *
 * Postconditions:
 *    - The dropdown will display options in a menu format and allow the user to 
 *      select an option.
 *
 * Error Conditions:
 *    - If `className` or any other prop is not passed correctly, the dropdown 
 *      may not render as expected.
 *    - If invalid props are passed to any Radix UI primitives, errors may occur.
 *
 * Side Effects:
 *    - The scroll buttons only display when there are more items than can fit in the dropdown view.
 *
 * Invariants:
 *    - The dropdown is always accessible through the `SelectTrigger` button.
 *
 * Known Faults: N/A
 */

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select" // Imports Radix UI's Select primitives for creating dropdown
import { Check, ChevronDown, ChevronUp } from "lucide-react" // Imports icons from lucide-react

import { cn } from "@/lib/utils" // Import utility function for conditional class names

const Select = SelectPrimitive.Root // Wrapping Radix's Select.Root for managing select state

const SelectGroup = SelectPrimitive.Group // Grouping of select items to organize the options

const SelectValue = SelectPrimitive.Value // Value represents the currently selected option

/*
 * Defines the button to open the dropdown.
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>, // Type for the ref of Radix's Trigger component
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> // Props for Radix's Trigger component
>(({ className, children, ...props }, ref) => (
  // Wraps the Select.Trigger with custom styles
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn( // Using the 'cn' function to conditionally apply classes
      // Custom styles for the Trigger component
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName // Sets display name

// ScrollUpButton handles the scroll up functionality for the dropdown
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  // Wraps Radix's ScrollUpButton with custom styles
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

// ScrollDownButton handles the scroll down functionality for the dropdown
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className // Allowing external class names
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

/*
 * Contains dropdown menu that holds the selectable items.
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" && // Adjust position if the dropdown is "popper"
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", // Adjusts for specific sides
        className
      )}
      position={position} // Position type for the dropdown
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

// Custom SelectLabel component, wraps Radix's Select.Label for labeling the dropdown
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} // Styles label
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

// SelectItem component, represents a selectable item in the dropdown
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Styling for each item
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/*
 * Used for visually separating groups of items within the dropdown.
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Exports the components for use in other files
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}