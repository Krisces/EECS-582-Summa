import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { writeFileSync } from 'fs';

type Result = {
    readonly error: string | undefined;
}

export async function fetchExpenses(email: string, randomSalt: string): Promise<Result> { // Change parameter to email
    console.log('Fetching expenses for user:', email);

    try {
        const expenses = await db.select()
            .from(Expenses)
            .where(eq(Expenses.createdBy, email)) // Use email instead of user ID
            .execute();

        console.log('Expenses retrieved:', expenses);

        if (!expenses || expenses.length === 0) {
            return { error: 'No expenses found for the user.' };
        }

        // Convert to CSV
        const csvData = expenses.map(expense => ({
            amount: expense.amount,
            categoryId: expense.categoryId,
            createdAt: expense.createdAt,
        }));

        const csvHeaders = Object.keys(csvData[0]).join(',');
        const csvRows = csvData.map(row => Object.values(row).join(',')).join('\n');
        const csv = `${csvHeaders}\n${csvRows}`;

        const months = (new Set(csvData.map(({ createdAt }) => createdAt.split('-')[1]))).size;

        if (months <= 3) {
            return { error: "Not enough months, please try again after 4 months worth of expenses" };
        }

        // Define the file path
        const filePath = `/tmp/${randomSalt}.csv`;
        console.log('Saving CSV file to:', filePath);

        // Ensure directory exists before writing the file
        writeFileSync(filePath, csv);

        console.log('Expenses saved to', filePath);
    } catch (error) {
        console.error('Error in fetchExpenses:', error);

        throw error; // Re-throw the error to propagate it
    }

    return { error: undefined }
}
