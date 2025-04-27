/** Prologue
 * FutureExpensesTable.tsx
 * 
 * This React component displays a list of future scheduled expenses in a tabular format.
 * 
 * Programmer: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
 * Date Created: 04/27/2025
 * 
 * Preconditions:
 * - `expensesList` must be an array of expense objects, each containing `id`, `name`, `amount`, and `createdAt`.
 * - `refreshData` must be a function that refreshes the data when called.
 * 
 * Postconditions:
 * - Displays a table of future expenses (scheduled after the current date).
 * - Allows users to see name, amount, date, and delete expenses.
 */

import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Trash, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import moment from 'moment';

// Interface representing a single expense object
interface Expense {
    id: number;
    name: string;
    amount: number;
    createdAt: string; // MM-DD-YYYY format
}

// Props interface for the FutureExpensesTable component
interface FutureExpensesTableProps {
    expensesList: Expense[];
    refreshData: () => void;
}

function FutureExpensesTable({ expensesList, refreshData }: FutureExpensesTableProps) {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    const deleteExpense = async (expense: Expense) => {
        try {
            const result = await db.delete(Expenses)
                .where(eq(Expenses.id, expense.id))
                .returning();

            if (result) {
                toast('Expense Deleted');
                refreshData();
            }
        } catch (error) {
            toast.error('Failed to delete expense');
        }
    };

    // Get current date in MM-DD-YYYY format for comparison
    const currentDate = moment().format('MM-DD-YYYY');

    // Filter for future expenses (after today)
    const futureExpenses = expensesList.filter(expense => {
        return moment(expense.createdAt, 'MM-DD-YYYY').isAfter(moment(currentDate, 'MM-DD-YYYY'));
    });

    // Sort future expenses by date, earliest first
    const sortedExpenses = [...futureExpenses].sort((a, b) => {
        return moment(a.createdAt, 'MM-DD-YYYY').valueOf() - moment(b.createdAt, 'MM-DD-YYYY').valueOf();
    });

    return (
        <div className="mb-6 border rounded-lg overflow-hidden">
            {/* Section Header with Toggle */}
            <div 
                className="bg-slate-100 p-3 flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 className="font-bold text-lg">Future Expenses ({futureExpenses.length})</h2>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
            
            {isExpanded && (
                <>
                    {/* Table Header */}
                    <div className='grid grid-cols-4 bg-slate-200 p-2'>
                        <h2>Name</h2>
                        <h2>Amount</h2>
                        <h2>Date</h2>
                        <h2>Action</h2>
                    </div>
                    
                    {/* Table Body */}
                    {sortedExpenses.length > 0 ? (
                        sortedExpenses.map((expense) => (
                            <div className='grid grid-cols-4 bg-slate-50 p-2 border-b last:border-b-0' key={expense.id}>
                                <h2>{expense.name}</h2>
                                <h2>${parseFloat(expense.amount.toString()).toFixed(2)}</h2>
                                <h2>{expense.createdAt}</h2>
                                <h2>
                                    <Trash
                                        className='text-red-600 cursor-pointer'
                                        onClick={() => deleteExpense(expense)}
                                    />
                                </h2>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            No future expenses scheduled
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default FutureExpensesTable;