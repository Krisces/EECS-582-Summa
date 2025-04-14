/**
Prologue:
Name of Program: app/layout.tsx
Description: Provides RootLayout
Inputs: None
Outputs: Exports RootLayout component for the app
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 02/16/2025
 */
import type { Metadata } from "next"; // Import type Metadata
import { Outfit } from "next/font/google"; // Import Outfit
import "./globals.css"; // Import css
import { ClerkProvider } from "@clerk/nextjs"; // Import Clerk Provider
import { Toaster } from "@/components/ui/sonner"; // Import Toaster component
import { DateRangeProvider } from '@/context/DateRangeContext'; // Import DateRangeProvider

// Define inter constant (for fonts)
const inter = Outfit({ subsets: ["latin"] });

// Export metadata 
export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

// Name: RootLayout
// Author: Kristin Boeckmann
// Date: 04/13/2025
// Preconditions: children (React node)
// Postconditions: Root layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <DateRangeProvider> {/* Wrap the app with DateRangeProvider */}
            {children}
            <Toaster />
          </DateRangeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}