"use client"

/**
 * Prologue
 * 
 * Name: Switch Component
 * Description: 
 * This component allows for a toggleable switch with a customizable appearance, including animations and state changes (checked/unchecked). 
 * The component forwards refs to ensure compatibility with parent components
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Vinayak Jha, Zach Alwin, Shravya Matta
 * Date Created: 03/09/2025
 * Last Revised: N/A
 * Revision History: N/A
 *
 * Preconditions:
 * - `@radix-ui/react-switch` and utility functions (`cn`) must be available
 *
 * Acceptable Input:
 * - All props that are valid for the `Switch` element in Radix UI
 *
 * Unacceptable Input:
 * - Any props that are incompatible with Radix UI `Switch` primitives
 *
 * Postconditions:
 * - The component renders a toggle switch that changes appearance based on its state
 * 
 * Error Handling: N/A
 * 
 * Side Effects:
 * - The state of the switch changes when clicked
 *
 * Invariants:
 * - The `Thumb` element will always be positioned correctly based on the checked state
 *
 * Known Faults: N/A
 */

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch" // Imports Radix UI primitives for the switch component

import { cn } from "@/lib/utils"

/*
 * Defines Switch component
 * Forwards the component's ref to the underlying `SwitchPrimitives.Root` to ensure compability with 
 * parent components that need to directly access the DOM element
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>, // Type of ref
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> // Type of props
>(({ className, ...props }, ref) => ( // Destructures props and className, and forwards the ref
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props} // Spreads the remaining props to the `SwitchPrimitives.Root`
    ref={ref} // Forwards the ref to the root component
  >
    <SwitchPrimitives.Thumb // The Thumb component represents the circular "thumb" of the switch
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName // Sets the displayName of the component

export { Switch }