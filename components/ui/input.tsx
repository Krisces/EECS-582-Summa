/**
 * Prologue
 * 
 * Input Component
 * 
 * This component displays a customizable input field with enhanced styling and accessibility features.
 * It applies Tailwind CSS for design consistency and allows additional styling through props
 * It uses `forwardRef` for compatibility with React forms and external references.
 * 
 * Dependencies: `cn` utility from `@/lib/utils` for class name merging.
 * 
 * Input:
 * - Accepts standard input types such as text, password, email, ...
 * - Supports additional class names via the `className` prop.
 * Output: An accessible and customizable input field 
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Zach Alwin, Vinayak Jha, Shravya Matta
 * Creation Date: 02/16/2025
 * 
 */

import * as React from "react" // Imports React and enables 'forwardRef'

import { cn } from "@/lib/utils" // Imports utility for merging class names

// The flexible input field that supports different types and customizable styles
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type} // Sets the input type based on props
        className={cn( // Merges extra class names seamlessly for extended styling
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref} // Enables ref forwarding for external control
        {...props} // Passes additional properties to enable further customization
      />
    )
  }
)
Input.displayName = "Input" // Assigns a display name to improve debugging and visibility in React DevTools

export { Input } // Exports component
