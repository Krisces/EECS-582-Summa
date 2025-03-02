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
import React, { useEffect, useState } from 'react'; // Imports React and hooks for component state management
import { db } from '@/utils/dbConfig'; // Imports database configuration
import { Categories, Expenses } from '@/utils/schema'; // Imports Schema definitions for Categories and Expenses tables
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'; // Imports SQL utilities from drizzle-orm for building queries
import { useUser } from '@clerk/nextjs'; // Imports clerk for user authentication
import ExpenseListTable from './_components/ExpenseListTable'; // Imports Expense List Table component
import moment from 'moment'; // Imports Moment.js for date manipulation
import { startOfMonth } from 'date-fns'; // Imports date-fns utility to get the start of the month

/**
 * This component displays a list of categories and expenses for the logged-in user. 
 * Fetches data based on the date range and category, and displays in a table format. 
 */
function Page() {
    const { user } = useUser(); // Gets the current authenticated user
    // Stores the list of categories and expenses
    const [categoryList, setCategoryList] = useState<any[]>([]);
    const [expensesList, setExpensesList] = useState<any[]>([]);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
        from: startOfMonth(new Date()), // Starts from the 1st day of the current month
        to: new Date(),
      });

      useEffect(() => {
        getCategoryList(); // Fetch category list and expenses when component mounts
    }, [dateRange]); // Fetch again when dateRange changes

    const getCategoryList = async () => {
        try {
          const formattedFromDate = moment(dateRange.from).format('MM-DD-YYYY'); // Format from date
          const formattedToDate = moment(dateRange.to).format('MM-DD-YYYY'); // Format to date
    
          const result = await db.select({
            ...getTableColumns(Categories), // Fetch columns from Categories table
            totalExpenses: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number), // Calculate total expenses per category
            totalItem: sql`COALESCE(COUNT(${Expenses.id}), 0)`.mapWith(Number) // Count total items per category
          })
            .from(Categories) // Starts query from the Categories table
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

    /**
     * Fetches the list of all expenses for the user
     */  
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
            
            setExpensesList(result); // Updates state
        } catch (error) {
          console.error("Error fetching expenses:", error);
        }
      };

  return (
    <div className='p-10'>
        {/* Page title */}
      <title>Summa Expenses</title>
        <h2 className='text-3xl font-bold flex justify-between items-center'>Latest Expenses</h2>
      {/* Expense list section */}
      <div className="mt-8 mb-16">
        <ExpenseListTable expensesList={expensesList} refreshData={() => getCategoryList} />
      </div>
    </div>
  )
}

export default Page // Exports component
