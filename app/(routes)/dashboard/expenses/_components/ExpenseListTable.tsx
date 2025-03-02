import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface Expense {
    id: number;
    name: string;
    amount: number;
    createdAt: string; // Adjust type if it's a Date object
}

interface ExpenseListTableProps {
    expensesList: Expense[];
    refreshData: () => void;
}

function ExpenseListTable({ expensesList, refreshData }: ExpenseListTableProps) {

    return (
        <div className='mt-3'>
            <div className='grid grid-cols-4 bg-slate-200 p-2'>
                <h2>Name</h2>
                <h2>Amount</h2>
                <h2>Date</h2>
                <h2>Action</h2>
            </div>
            {expensesList.map((expense) => (
                <div className='grid grid-cols-4 bg-slate-50 p-2' key={expense.id}>
                    <h2>{expense.name}</h2>
                    <h2>{expense.amount}</h2>
                    <h2>{expense.createdAt}</h2>
                </div>
            ))}
        </div>
    );
}

export default ExpenseListTable;