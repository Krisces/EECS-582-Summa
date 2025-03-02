/**
 * Prologue
 * SideNav
 * This component displays the sidebar navigation for the dashboard, allowing users 
 * to navigate between different sections.
 * Highlights the active menu item based on the current path.
 * Includes a logo and a user profile button.
 * 
 * Dependencies: Next.js `Image`, `Link`, and `usePathname` for routing and image handling.
 */

"use client"; // Enables client-side rendering
import { UserButton } from '@clerk/nextjs'; // Imports Clerk's UserButton for authentication
import { ChartSpline, LayoutGrid, LibraryBig, ReceiptText } from 'lucide-react'; // Imports Lucide-react icons for visual representation of menu items.
import Image from 'next/image';
import Link from 'next/link'; // Imports Next.js Link component for navigation
import { usePathname } from 'next/navigation'; // Imports Next.js usePathname hook for routing
import React, { useEffect } from 'react';

// Defines structure for menu items
interface MenuItem {
    id: number;
    name: string;
    icon: React.ElementType; // Using React element type for icons
    path: string;
}

// This component displays a sidebar with navigation links and a profile button.
function SideNav() {
    // Defines menu list
    const menuList: MenuItem[] = [
        { id: 1, name: 'Dashboard', icon: LayoutGrid, path: '/dashboard' },
        { id: 2, name: 'Categories', icon: LibraryBig, path: '/dashboard/categories' },
        { id: 3, name: 'Expenses', icon: ReceiptText, path: '/dashboard/expenses' },
        { id: 4, name: 'Data Insights', icon: ChartSpline, path: '/dashboard/data-insights' }
    ];

    const path = usePathname(); // Gets the current pathname

    useEffect(() => {
        console.log(path); // Logs the current path
    }, [path]);

    return (
        <div className='h-screen p-5 border shadow-sm'>
            {/* Displays logo section */}
            <div className='mt-2 mb-5'>
                <Image src={'/logo.svg'} alt='logo' width={160} height={100} />
            </div>
            <div>
                {/* Menu navigation */}
                {menuList.map((menu) => {
                    const isActive = path === menu.path; // Checks if the menu items are active
                    return (
                        {/* Navigation link */}
                        <Link href={menu.path} key={menu.id}>
                            <h2
                                className={`flex gap-2 items-center text-gray-500 font-medium mb-2 p-6 cursor-pointer rounded-md hover:text-primary hover:bg-violet-100 ${isActive ? 'text-primary bg-violet-100' : ''}`}
                            >
                                <menu.icon /> {/* Display menu icon */}
                                <span>{menu.name}</span>
                            </h2>
                        </Link>
                    );
                })}
            </div>
            {/* User Profile Section */}
            <div className='fixed bottom-5 p-5 flex gap-2 items-center'>
                <UserButton />
                <span>Profile</span>
            </div>
        </div>
    );
}

export default SideNav;
