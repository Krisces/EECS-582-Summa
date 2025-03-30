/*
Prologue Comments
Name: Skeleton
Description: This is a skeleton component that provides a placeholder for loading content.
Programmers: Zach Alwin, Kisten Bockmann, Lisa Phan, Vinayak Jha, Shravya Matta
Date Created: 3-15-2025
Last Modified: 3-16-2025
Preconditions: N/A
Postconditions: N/A
Error and Exceptions: N/A
Side Effects: N/A
Invariants: N/A
Known Faults: N/A
*/
// Import the cn utility function from the utils library
import { cn } from "@/lib/utils"

// Define the Skeleton component
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    // Render a div with animation and styling for the skeleton placeholder
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// Export the Skeleton component
export { Skeleton }