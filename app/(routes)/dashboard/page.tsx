"use client";
import React, { useState } from 'react'
import { useUser } from '@clerk/nextjs';
import AddIncome from './_components/AddIncome';
import Overview from './_components/Overview';
import AddExpenseDialog from './_components/AddExpnseDialog';
import CardInfo from './_components/CardInfo';
import CategoryChart from './_components/CategoryChart';
import CategoryStats from './_components/CategoryStats';
import { startOfMonth } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

function Dashboard() {
  const { user } = useUser();
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [months, setMonths] = useState<number[]>([]); // For month numbers
  const [years, setYears] = useState<number[]>([]); // For year numbers
  const [period, setPeriod] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const [timeframe, setTimeframe] = useState<'year' | 'month'>('year');
  const [barChartData, setBarChartData] = useState<any[]>([]);
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

export default Dashboard