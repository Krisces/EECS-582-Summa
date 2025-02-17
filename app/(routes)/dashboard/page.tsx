"use client";
import React from 'react'
import { useUser } from '@clerk/nextjs';

function Dashboard() {
  const { user } = useUser();
  return (
    <div>
        <title>Summa Dashboard</title>
      <div className="p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="font-bold text-3xl">{`Hi, ${user?.username}`}</h2>
            <p className="text-gray-500">Here is what is happening with your money. Let us manage your expenses</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard