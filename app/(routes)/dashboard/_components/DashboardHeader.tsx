/**
 * DashboardHeader 
 * This component displays dashboard's header, including a user button 
 * provided by Clerk for authentication.
 * Includes a flexbox-based layout for proper alignment.
 */

import { UserButton } from '@clerk/nextjs';
import React from 'react'; // Import React library

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
