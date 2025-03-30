/**
 * Prologue
 * Name: Badge Component
 * Description: This code creates a reusable Badge component in React, utilizing the class-variance-authority (CVA) 
 * utility to dynamically manage variant styles. It uses Tailwind CSS classes to style various badge types, 
 * including default, secondary, destructive, and outline.
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Zach Alwin, Vinayak Jha, Shravya Matta
 * Created: 03/29/2025
 * 
 * Preconditions:
 * - Requires React and Tailwind CSS.
 * - Must have class-variance-authority and a utility function cn available.
 * 
 * Acceptable Input:
 * - variant prop: "default" | "secondary" | "destructive" | "outline"
 * 
 * Unacceptable Input:
 * - Invalid variant values outside the defined options.
 * 
 * Postconditions: N/A
 * 
 * Return Values:
 * - A React component that renders a badge with the appropriate styles.
 * 
 * Error Handling:
 * - If an unsupported variant is provided, the default variant is used.
 * 
 * Side Effects: N/A
 * 
 * Invariants:
 * - The Badge component always renders a <div> element.
 * - It always applies the badgeVariants styles.
 * 
 * Known Issues: N/A
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority" // Imports cva for dynamic class management and VariantProps for type safety

import { cn } from "@/lib/utils"

/**
 * Defines badgeVariants using cva to handle different badge styles
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    // Sets the default variant to "default"
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps // Defines an interface BadgeProps for the Badge component
  extends React.HTMLAttributes<HTMLDivElement>, // Extends React.HTMLAttributes<HTMLDivElement> to allow standard HTML div attributes
    VariantProps<typeof badgeVariants> {}

// Define the Badge component
function Badge({ className, variant, ...props }: BadgeProps) {
  return ( // Renders a div with the combined class names using cn
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }