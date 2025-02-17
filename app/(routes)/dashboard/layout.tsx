"use client"
import React, { ReactNode, useEffect } from 'react';
import SideNav from './_components/Sidenav';
import DashboardHeader from './_components/DashboardHeader';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  
  return (
    <div>
      <div className='fixed md:w-64 hidden md:block z-10'>
        <SideNav />
      </div>
      <div className='md:ml-64'>
        <DashboardHeader />
        {children}
      </div>
      <div>
      </div>
    </div>
  );
}

export default DashboardLayout;