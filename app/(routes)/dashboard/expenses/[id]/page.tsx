/**
 * Prologue
 * ExpensesScreen Component
 * 
 * This component displays the user's expenses for a specific category. 
 * It displays category information and the list of expenses for that category. 
 * Users can also add new expenses through the component.
 * 
 * Input:
 * - A valid category ID string of `params.id`.
 * - Valid `user` object
 * Output: A JSX that renders the expenses and category info.
 * 
 * Error and exception conditions: If an error occurs during data fetching (e.g., network failure), it will log an error message to the console.
 * 
 * Dependencies:
 * - `db` (database configuration)
 * - `Categories`, `Expenses` (schemas for database tables)
 * - `useUser` from `@clerk/nextjs` for user authentication
 * - `drizzle-orm` for SQL querying
 * - `lucide-react` for icons
 * - `react-toastify` for notifications
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Zach Alwin, Vinayak Jha, Shravya Matta 
 * Creation Date: 03/01/2025
 */

"use client"
import { db } from '@/utils/dbConfig' // Imports database configuration
import { Categories } from '@/utils/schema'  // Imports category schema
import { Expenses } from '@/utils/schema' // Imports expenses schema
import { useUser } from '@clerk/nextjs' // Imports clerk for user authentication
import { desc, eq, getTableColumns, sql } from 'drizzle-orm' // Imports SQL querying utilities
import React, { useEffect, useState } from 'react' // Imports React libraries for state and effects
import AddExpense from '../_components/AddExpenseWindow' // Imports Add Expense component
import ExpenseListTable from '../_components/ExpenseListTable' // Imports Expense List Table component
import { ArrowLeft, PenBox, Trash } from 'lucide-react' // Icons for UI
import { useRouter } from 'next/navigation' // Imports router for navigation
import CategorytItem from '../../categories/_components/CategoryItem' // Imports Category Item component
import { toast } from 'react-toastify' // Imports toast for notifications

//This component displays the user's expenses for a specific category
function ExpensesScreen({ params }: any) {
    const { user } = useUser(); // Gets current user from Clerk 
    // Stores category information and list of expenses
    const [categoryInfo, setCategoryInfo] = useState<any>(null);
    const [expensesList, setExpensesList] = useState<any[]>([]);
    const route = useRouter(); // Router instance for navigation

    // Fetches category information only when user is logged in
    useEffect(() => {
        user && getCategoryInfo();
    }, [user]);

    /**
     * Fetches category information along with total spending and the number of items in that category
     */
    const getCategoryInfo = async () => {
        try {
            // Fetches data from the Categories table and join with Expenses table
            const result = await db
                .select({
                    ...getTableColumns(Categories),
                    totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number), // Calculates total spending
                    totalItem: sql`count(${Expenses.id})`.mapWith(Number), // Counts the number of expenses
                })
                .from(Categories)
                .leftJoin(Expenses, eq(Categories.id, Expenses.categoryId)) // Left join with expenses
                .where(
                    // Fetches user's categories only
                    sql`${Categories.createdBy} = ${user?.primaryEmailAddress?.emailAddress as string} AND ${Categories.id} = ${params.id}`
                )
                .groupBy(Categories.id); // Group by category ID

            // Sets the category information state based on fetched data 
            setCategoryInfo(result['0']);
            getExpensesList();
        } catch (error) {
            // Logs error in case of failure
            console.error('Error fetching category info:', error);
        }
    };    

    /**
     * Get Latest Expenses
     * Retrieves all expenses related to the current category
     */
    const getExpensesList = async () => {
        // Fetches expenses data from the Expenses table
        const result = await db
            .select()
            .from(Expenses)
            .where(eq(Expenses.categoryId, params.id)) // Fetches expenses for current category only
            .orderBy(desc(Expenses.id)); // Order expenses by descending ID

        setExpensesList(result); // Sets the fetched expenses list into the state
    };


    return (
        <div className='p-10'>
            {/* Header Section - Title and Back Button */}
            <h2 className='text-3xl font-bold flex justify-between items-center'>
                <span className='flex gap-2 items-center'>
                    <ArrowLeft onClick={() => route.back()} className='cursor-pointer' />
                    My Expenses
                </span>
            </h2>
            {/* Category and Add Expense Section */}
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {categoryInfo ? (
                    <CategorytItem category={categoryInfo} />
                ) : (
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'>
                    </div>
                )}
                {/* Add Expense Component */}
                <AddExpense categoryId={params.id}
                    user={user}
                    refreshData={() => getCategoryInfo()}
                />
            </div>
            {/* Latest Expenses Section */}
            <div className='mt-4'>
                <h2 className='font-bold text-lg'>Latest Expenses</h2>
                <ExpenseListTable expensesList={expensesList}
                    refreshData={() => getCategoryInfo()} />
            </div>
        </div>
    );
}

export default ExpensesScreen; // Exports component
