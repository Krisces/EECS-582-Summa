/**
 * Prologue
 * ExpensesPage Component
 *  
 * This component displays a list of the user's expenses, categorized by type. 
 * It fetches the expense data and category list from the database and allows users to filter expenses by a date range. 
 * 
 * Input:
 * - valid Date objects of `dateRange.from` and `dateRange.to`
 * - `user` object must contain a valid email address 
 * Output: The component returns JSX that renders the expense data and total expenses for each category.
 * 
 * Error and Exception Conditions: If the user has no expenses or categories within the selected date range, the table will be empty.
 * 
 * Dependencies:
 * - `db` (database configuration)
 * - `Categories`, `Expenses` (schemas for database tables)
 * - `useUser` from `@clerk/nextjs` for user authentication
 * - `drizzle-orm` for SQL querying
 * - `moment` for date formatting
 * - `date-fns` for date manipulation
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Zach Alwin, Vinayak Jha, Shravya Matta 
 * Creation Date: 03/01/2025
 */

"use client"
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/dbConfig';
import { Categories, Expenses } from '@/utils/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import LatestExpensesTable from './_components/LatestExpensesTable'
import FutureExpensesTable from './_components/FutureExpensesTable'
import moment from 'moment';
import { startOfMonth } from 'date-fns';
import Chatbot from '../_components/chatbot';

function Page() {

  const { user } = useUser();
  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
      from: startOfMonth(new Date()),
      to: new Date(),
    });

      // Fetch categories on mount and when dateRange changes
  useEffect(() => {
    if (user) {
      getCategoryList();
    }
  }, [user, dateRange]); // Fetch data when user or dateRange changes

  // Add a separate useEffect to fetch data on component mount
  useEffect(() => {
    if (user) {
      getCategoryList();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const getCategoryList = async () => {
    try {
      const formattedFromDate = moment(dateRange.from).format('MM-DD-YYYY'); // Format from date
      const formattedToDate = moment(dateRange.to).format('MM-DD-YYYY'); // Format to date

      const result = await db.select({
        ...getTableColumns(Categories), // Fetch columns from Categories table
        totalExpenses: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number), // Calculate total expenses per category
        totalItem: sql`COALESCE(COUNT(${Expenses.id}), 0)`.mapWith(Number) // Count total items per category
      })
        .from(Categories)
        .leftJoin(
          Expenses,
          eq(Categories.id, Expenses.categoryId) // Join Categories with Expenses
        )
        .where(
          sql`${Categories.createdBy} = ${user?.primaryEmailAddress?.emailAddress as string}
            AND (${Expenses.createdAt} >= ${formattedFromDate}
            AND ${Expenses.createdAt} <= ${formattedToDate}
            OR ${Expenses.createdAt} IS NULL)` // Check for NULL and date range
        )
        .groupBy(Categories.id) // Group by category ID
        .orderBy(desc(Categories.id)) // Order by category ID descending
        .execute();

      setCategoryList(result); // Update state with fetched category list
      getAllExpenses();

      // Calculate total expenses across all categories
      const totalExpenses = result.reduce((sum: number, item: any) => sum + (item.totalExpenses || 0), 0);
      setTotalExpenses(totalExpenses); // Update total expenses state
    } catch (error) {
      console.error("Error fetching category list:", error); // Log error for debugging
    }
  };

  const getAllExpenses = async () => {
    try {
      const result = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
          createdBy: Expenses.createdBy,
          categoryName: Categories.name, // Include category name if needed
        })
        .from(Expenses) // Start from Expenses to ensure all expenses are fetched
        .leftJoin(Categories, eq(Categories.id, Expenses.categoryId)) // Use leftJoin if you want all expenses
        .where(eq(Expenses.createdBy, user?.primaryEmailAddress?.emailAddress as string)) // Ensure the user is the one who created the expenses
        .orderBy(desc(Expenses.id)); // Order expenses by ID in descending order
        
        setExpensesList(result);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  return (
    <div className='p-10'>
      <title>Summa Expenses</title>
        <h2 className='text-3xl font-bold flex justify-between items-center'>Expenses</h2>
        <div className='mt-4'>
            <LatestExpensesTable 
                    expensesList={expensesList}
                    refreshData={() => getCategoryList()}
            />
            <FutureExpensesTable 
                    expensesList={expensesList}
                    refreshData={() => getCategoryList()}
            />
        </div>
        <div>
          <Chatbot/>
        </div>
    </div>
  )
}

export default Page