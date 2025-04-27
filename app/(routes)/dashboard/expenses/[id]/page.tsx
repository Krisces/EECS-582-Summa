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
// Import the new table components
import LatestExpensesTable from '../_components/LatestExpensesTable'
import FutureExpensesTable from '../_components/FutureExpensesTable'
import { ArrowLeft, PenBox, Trash } from 'lucide-react' // Icons for UI
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation' // Imports router for navigation
import EditCategory from '../_components/EditCategory'
import CategorytItem from '../../categories/_components/CategoryItem'
import { toast } from 'react-toastify' // Imports toast for notifications
import { Button } from '@/components/ui/button'
import Chatbot from '../../_components/chatbot'

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

    /**
     * Use to Delete Category
     */
    const deleteCategory = async () => {

        const deleteExpenseResult = await db.delete(Expenses)
            .where(eq(Expenses.categoryId, params.id))
            .returning()

        if (deleteExpenseResult) {
            const result = await db.delete(Categories)
                .where(eq(Categories.id, params.id))
                .returning();
        }
        toast('Category Deleted!');
        route.replace('/dashboard/categories')
    }


    return (
        <div className='p-10'>
            <h2 className='text-3xl font-bold flex justify-between items-center'>
                <span className='flex gap-2 items-center'>
                    <ArrowLeft onClick={() => route.back()} className='cursor-pointer' />
                    My Expenses
                </span>
                <div className='flex gap-2 items-center'>
                <EditCategory categoryInfo={categoryInfo} refreshData={()=>getCategoryInfo()}/>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className='flex gap-2' variant="destructive"> <Trash /> Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your current budget along with expenses
                                and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteCategory()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {categoryInfo ? (
                    <CategorytItem category={categoryInfo} />
                ) : (
                    <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'>
                    </div>
                )}
                <AddExpense categoryId={params.id}
                    user={user}
                    refreshData={() => getCategoryInfo()}
                />
            </div>
            <div className='mt-4'>
                <LatestExpensesTable 
                    expensesList={expensesList}
                    refreshData={() => getCategoryInfo()} 
                />
                <FutureExpensesTable 
                    expensesList={expensesList}
                    refreshData={() => getCategoryInfo()} 
                />
            </div>
            <div>
                <Chatbot/>
            </div>
        </div>
    );
}

export default ExpensesScreen; // Exports component
