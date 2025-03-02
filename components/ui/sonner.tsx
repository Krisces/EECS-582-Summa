/**
 * Prologue
 * 
 * Toaster Component
 * 
 * This component offers a customizable notification system utilizing Sonner. 
 * It integrates with Next.js themes and applies dynamic styling based on the active theme.
 * The component prioritizes accessibility and design consistency.
 * 
 * Dependencies:
 * - `Sonner` provides the toast notification system.
 * - `useTheme` from `next-themes` is used to dynamically apply themes.
 * 
 * Input : All valid Sonner props for customization.
 * Output: A notification toaster with theme-based styling
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Zach Alwin, Vinayak Jha, Shravya Matta 
 * Creation Date: 02/16/2025
 */

"use client" // Enables client-side rendering

import { useTheme } from "next-themes" // Imports theme hook for dynamic styling
import { Toaster as Sonner } from "sonner" // Imports Sonner for notifications

type ToasterProps = React.ComponentProps<typeof Sonner> // Defines props based on Sonner's component props

// A customizable toast notification system that adapts to the selected theme
const Toaster = ({ ...props }: ToasterProps) => {
  // Retrieves the current theme with a default fallback
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]} // Applies the theme to Sonner
      className="toaster group" // Applies base styles to the toaster
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground", // Styles description text
          actionButton: // Styles action button
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: // Styles cancel button
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props} // Passes additional properties to enable further customization
    />
  )
}

export { Toaster } // Exports component
