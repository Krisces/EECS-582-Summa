/**
 * Prologue
 * 
 * DashboardHeader Component
 *  
 * This component displays dashboard's header, including a user button provided 
 * by Clerk for authentication.
 * Includes a flexbox-based layout for proper alignment.
 * 
 * Input: None
 * Output: A JSX element rendering the header with a user button
 * 
 * Dependencies:
 * - `@clerk/nextjs` for `UserButton` component to manage user sessions
 * - `React` for component rendering
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Zach Alwin, Vinayak Jha, Shravya Matta 
 * Creation Date: 02/16/2025
 */

import { UserButton } from '@clerk/nextjs'; // Imports clerk for user authentication
import React from 'react'; // Imports React library

// The component displays a simple dashboard header 
function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between items-center'>
      <div></div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader; // Export component
