import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Define button styles using class-variance-authority (CVA) for consistent styling
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Default button style
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90", // Destructive action style
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Outline button style
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80", // Secondary button style
        ghost: "hover:bg-accent hover:text-accent-foreground", // Ghost button style (no background)
        link: "text-primary underline-offset-4 hover:underline", // Link-style button
      },
      size: {
        default: "h-10 px-4 py-2", // Default size
        sm: "h-9 rounded-md px-3", // Small size
        lg: "h-11 rounded-md px-8", // Large size
        icon: "h-10 w-10", // Icon button (square)
      },
    },
    defaultVariants: {
      variant: "default", // Default variant is primary button
      size: "default", // Default size is normal
    },
  }
)

// Define the Button component interface, extending standard button props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean // Allows rendering a custom component instead of a <button>
}

// Button component with support for variants, sizes, and child components
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button" // If asChild is true, render a custom component
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))} // Apply styles dynamically
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button" // Set a display name for debugging

export { Button, buttonVariants }
