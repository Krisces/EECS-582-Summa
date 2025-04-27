/**
Prologue:
Name of Program: lib/fetchExpenses.ts
Description: Provides fetchExpenses function to fetch expenses for ml prediction
Inputs: None
Outputs: Exports Dashboard component to show the dashboard
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 04/27/2025
*/
import { db } from '@/utils/dbConfig'; // Import db
import { Expenses } from '@/utils/schema'; // Import Expenses table
import { eq } from 'drizzle-orm'; // Import eq operation
import { writeFileSync } from 'fs'; // Import write file function

// Define type of result
type Result = {
    // Error can be string or undefined (if undefined, then it was a success)
    readonly error: string | undefined;
}

// Name: fetchExpenses
// Author: Kristin Boeckmann
// Date: 04/27/2025
// Preconditions: email of the user, and random salt for json/csv I/O
// Postconditions: Promise of Result
export async function fetchExpenses(email: string, randomSalt: string): Promise<Result> { // Change parameter to email
    console.log('Fetching expenses for user:', email);
    try {
        const expenses = await db.select()
            .from(Expenses)
            .where(eq(Expenses.createdBy, email)) // Use email instead of user ID
            .execute(); // Fetch all the expenses

        console.log('Expenses retrieved:', expenses);

        if (!expenses || expenses.length === 0) {
            // If no expenses were found, return this error
            return { error: 'No expenses found for the user.' };
        }

        // Convert to CSV
        const csvData = expenses.map(expense => ({
            amount: expense.amount,
            categoryId: expense.categoryId,
            createdAt: expense.createdAt,
        }));

        const csvHeaders = Object.keys(csvData[0]).join(','); // Get the headers
        const csvRows = csvData.map(row => Object.values(row).join(',')).join('\n'); // Get the csv rows
        const csv = `${csvHeaders}\n${csvRows}`; // Make the CSV

        const months = (new Set(csvData.map(({ createdAt }) => createdAt.split('-')[1]))).size; // Get the total months shown in expenses

        if (months <= 3) {
            // If months is less than 3, return this error (since the model prediction is not accurate for less than 4)
            return { error: "Not enough months, please try again after 4 months worth of expenses" };
        }

        // Define the file path
        const filePath = `/tmp/${randomSalt}.csv`; // This file will be written to
        console.log('Saving CSV file to:', filePath); // Log the file path

        // Write to the the file
        writeFileSync(filePath, csv);

        console.log('Expenses saved to', filePath);
    } catch (error) {
        console.error('Error in fetchExpenses:', error);

        throw error; // Re-throw the error to propagate it
    }

    // If everything was a success, we had no error.
    return { error: undefined }
}
