/** Prologue
 * ExpenseListTable.tsx
 * 
 * This React component displays a list of expenses in a tabular format.
 * Each row represents an expense with its name, amount, date, and an action column.
 * 
 * Programmer: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
 * Date Created: 02/28/2025
 * Last Revised: 03/01/2025
 * 
 * Revisions:
 * - N/A
 * 
 * Preconditions:
 * - `expensesList` must be an array of expense objects, each containing `id`, `name`, `amount`, and `createdAt`.
 * - `refreshData` must be a function that refreshes the data when called.
 * 
 * Postconditions:
 * - Displays a table of expenses.
 * - Allows users to see name, amount, and date.
 * 
 * Side Effects:
 * - None.
 * 
 * Known Issues:
 * - `createdAt` is assumed to be a string; if it's a Date object, adjustments may be required.
 */

import { db } from '@/utils/dbConfig'; // Import database configuration
import { Expenses } from '@/utils/schema'; // Import schema for expenses
import { eq } from 'drizzle-orm'; // Import equality function for queries
import { Trash } from 'lucide-react'; // Import trash icon for delete action
import React from 'react'; // Import React library
import { toast } from 'sonner'; // Import toast notifications

// Interface representing a single expense object
interface Expense {
    id: number; // Unique identifier for the expense
    name: string; // Name or description of the expense
    amount: number; // Amount spent
    createdAt: string; // Date of expense creation (string format)
}

// Props interface for the ExpenseListTable component
interface ExpenseListTableProps {
    expensesList: Expense[]; // List of expenses to display
    refreshData: () => void; // Function to refresh data when an expense is deleted
}

/**
 * ExpenseListTable Component
 * 
 * Displays a list of expenses in a table format with columns for name, amount, date, and actions.
 * 
 * @param {Expense[]} expensesList - List of expense objects to be displayed.
 * @param {Function} refreshData - Function to refresh the expense list.
 * @returns {JSX.Element} A table of expenses with an action column.
 */
function ExpenseListTable({ expensesList, refreshData }: ExpenseListTableProps) {
    return (
        <div className='mt-3'> {/* Container for the table */}
            {/* Table Header */}
            <div className='grid grid-cols-4 bg-slate-200 p-2'>
                <h2>Name</h2>
                <h2>Amount</h2>
                <h2>Date</h2>
                <h2>Action</h2>
            </div>
            {/* Table Body */}
            {expensesList.map((expense) => (
                <div className='grid grid-cols-4 bg-slate-50 p-2' key={expense.id}> {/* Row for each expense */}
                    <h2>{expense.name}</h2> {/* Expense name */}
                    <h2>{expense.amount}</h2> {/* Expense amount */}
                    <h2>{expense.createdAt}</h2> {/* Expense creation date */}
                </div>
            ))}
        </div>
    );
}

export default ExpenseListTable; // Export the component for use elsewhere
