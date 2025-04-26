import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { writeFileSync } from 'fs';

export async function fetchExpenses(email: string, randomSalt: string) { // Change parameter to email
    console.log('Fetching expenses for user:', email);

    try {
        const expenses = await db.select()
            .from(Expenses)
            .where(eq(Expenses.createdBy, email)) // Use email instead of user ID
            .execute();

        console.log('Expenses retrieved:', expenses);

        if (!expenses || expenses.length === 0) {
            throw new Error('No expenses found for the user.');
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
}
