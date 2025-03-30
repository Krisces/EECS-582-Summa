"use client"
/** 
 * Prologue 
 * Name: Label Component
 * Description: This code defines a reusable Label component using Radix UI's `@radix-ui/react-label`.
 *              It applies custom styling via `class-variance-authority` (cva) and supports variants.
 * 
 * Programmer: Kristin Boeckmann, Lisa Phan, Vinayak Jha, Zach Alwin, Shravya Matta
 * Date Created: 03/39/2025
 * 
 * Preconditions:
 * - Requires React and Radix UI's @radix-ui/react-label.
 * - Utility function cn must be available from "@/lib/utils".
 *
 * Acceptable Inputs:
 * - className: Optional custom class names for additional styling.
 * - ref: Forwarded reference for external component control.
 *
 * Unacceptable Inputs:
 * - Non-HTML attributes not supported by <label>.
 *
 * Return Values:
 * - A JSX element representing a label with customizable styles.
 *
 * Error Handling:
 * - If @radix-ui/react-label or class-variance-authority is missing, the component may not work correctly.
 *
 * Side Effects: N/A
 *
 * Invariants:
 * - The label maintains accessibility support and follows the design system.
 *
 * Known Issues: N/A
 */
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label" // Imports LabelPrimitive from Radix UI to use its label components
import { cva, type VariantProps } from "class-variance-authority" // Imports cva and VariantProps from the class-variance-authority package

import { cn } from "@/lib/utils"

// Defines a labelVariants constant that specifies default styles and any conditional styles
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

/**
 * Creates a Label component that accepts both LabelPrimitive props 
 * and the variant props from labelVariants
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>, // Type for the forwarded ref
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> // Variant props based on the defined labelVariants
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
// Sets the display name of the Label component
Label.displayName = LabelPrimitive.Root.displayName

export { Label }