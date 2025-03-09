/**
 * Popover Component
 * 
 * This module provides a reusable popover component using Radix UI's Popover primitives.
 * It includes a root popover element, a trigger, and a content section with animations.
 * 
 * Programmer: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
 * Date Created: 02/19/2025
 * 
 * Revisions:
 * N/A
 * 
 * Preconditions:
 * - This component requires `@radix-ui/react-popover` for functionality.
 * - Requires `cn` utility for class name merging.
 * 
 * Postconditions:
 * - Provides a popover UI element that can be used in various parts of the application.
 * 
 * Side Effects:
 * - Uses a portal to render the popover outside the normal DOM hierarchy.
 * 
 * Known Issues:
 * - None known at this time.
 */


"use client"

import * as React from "react" // Import React for component creation
import * as PopoverPrimitive from "@radix-ui/react-popover" // Import Radix UI popover primitives

import { cn } from "@/lib/utils" // Import utility function for conditional class names

// Root popover component wrapper
const Popover = PopoverPrimitive.Root

// Popover trigger element, acts as a button or interactive element to open the popover
const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * PopoverContent Component
 * 
 * This component is the content area of the popover, containing any elements inside it.
 * It uses animations for opening and closing effects and supports alignment and side offset.
 * 
 * @param {string} className - Additional class names for styling.
 * @param {string} align - Alignment of the popover relative to the trigger (default: "center").
 * @param {number} sideOffset - Distance between the trigger and the popover content (default: 4px).
 * 
 * @returns {JSX.Element} A portal-rendered popover content component.
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref} // Assigns forwarded ref for direct DOM manipulation
      align={align} // Sets the alignment of the popover
      sideOffset={sideOffset} // Defines spacing between trigger and popover
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}  // Passes additional props to Radix Popover Content
    />
  </PopoverPrimitive.Portal>
))
// Assign display name for better debugging and dev tools support
PopoverContent.displayName = PopoverPrimitive.Content.displayName

// Export components for use in other parts of the application
export { Popover, PopoverTrigger, PopoverContent }