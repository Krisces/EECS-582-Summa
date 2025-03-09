import type { Metadata } from "next";  // Importing Metadata type from Next.js for type safety and metadata handling
import { Outfit } from "next/font/google";  // Importing the 'Outfit' font from Google Fonts using Next.js font optimization
import "./globals.css";  // Importing global CSS for the app's styles
import { ClerkProvider } from "@clerk/nextjs";  // ClerkProvider for integrating Clerk authentication in the app
import { Toaster } from "@/components/ui/sonner";  // Importing a Toaster component for showing notifications (like success or error messages)

// Using the Outfit font with the "latin" subset for the entire app
const inter = Outfit({ subsets: ["latin"] });

// RootLayout component that wraps the entire app's layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;  // Defining the expected children prop as React nodes (components, elements, etc.)
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
