/**
Prologue:
Name of Program: app/(routes)/dashboard/page.tsx
Description: Provides Dashboard JSX Component.
Inputs: None
Outputs: Exports Dashboard component to show the dashboard
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 02/16/2025
 */
"use client";
// Import React and useState hook
import React, { useState } from 'react'
// Import useUser hook
import { useUser } from '@clerk/nextjs';
// Import AddIncome component
import AddIncome from './_components/AddIncome';
// Import Overview component
import Overview from './_components/Overview';
// Import AddExpenseDialog component
import AddExpenseDialog from './_components/AddExpnseDialog';
// Import CardInfo component
import CardInfo from './_components/CardInfo';
// Import CategoryChart component
import CategoryChart from './_components/CategoryChart';
// Import CategoryStats component
import CategoryStats from './_components/CategoryStats';
// Import startOfMonth
import { startOfMonth } from 'date-fns';
// Import Skeleton component
import { Skeleton } from '@/components/ui/skeleton';

// Name: Dashboard
// Author: Lisa Phan
// Date: 03/09/2025
// Preconditions: None
// Postconditions: JSX Component to show the dashboard
function Dashboard() {
  // Get the user
  const { user } = useUser();
  // Initialize categotyList state
  const [categoryList, setCategoryList] = useState<any[]>([]);
  // Initialize expensesList state
  const [expensesList, setExpensesList] = useState<any[]>([]);
  // Initialize totalIncome state
  const [totalIncome, setTotalIncome] = useState<number>(0);
  // Initialize totalExpenses state
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  // Initialize dateRange state
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  // Initialize loading state
  const [loading, setLoading] = useState<boolean>(true);
  // Initialize months state
  const [months, setMonths] = useState<number[]>([]); // For month numbers
  // Initialize years state
  const [years, setYears] = useState<number[]>([]); // For year numbers
  // Initialize period state
  const [period, setPeriod] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  // Initialize time frame state
  const [timeframe, setTimeframe] = useState<'year' | 'month'>('year');
  // Initialize barChartDate state
  const [barChartData, setBarChartData] = useState<any[]>([]);
  // Assign the month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <title>Summa Dashboard</title>
      <div className="p-10">
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="font-bold text-3xl">{`Hi, ${user?.username}`}</h2>
            <p className="text-gray-500">Here is what is happening with your money. Let us manage your expenses</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 md:justify-end">
            <div className="flex flex-wrap gap-2 justify-end">
              <AddIncome refreshData={() => {
              }} />
              <AddExpenseDialog refreshData={() => {
              }} />
            </div>
          </div>
        </div>
      </div>
      <Overview dateRange={dateRange} setDateRange={setDateRange} />
      <CardInfo totalIncome={totalIncome} totalExpenses={totalExpenses} />
      {/* Category Stats and Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 mx-10 my-5 gap-5">
        <div className="md:col-span-2 p-7 border rounded-lg flex flex-col h-auto">
          {loading ? (
            <Skeleton className="w-full h-86" /> // Show skeleton loading state
          ) : (
            <CategoryStats categoryList={categoryList} totalIncome={totalIncome} /> // Pass category list and income to CategoryStats
          )}
        </div>
        <div className="p-7 border rounded-lg flex items-center h-auto">
          <CategoryChart categoryList={categoryList} />
        </div>
      </div>
    </div>
  )
}

// Export the dashboard component
export default Dashboard