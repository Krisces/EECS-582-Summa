/**
Prologue:
Name of Program: app/(routes)/dashboard/actions.ts
Description: Provides predictSpending function
Inputs: None
Outputs: Exports predict spending function
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 04/27/2025
*/
'use server'; // Make it server side
import { spawn } from 'child_process'; // Import spawn
import { fetchExpenses } from '@/lib/fetchExpenses'; // Import fetchExpenses
import { v4 as uuidv4 } from 'uuid'; // Import v4 for uuid
import { readFileSync } from 'fs'; // Import file read function


// Declaration of type for predictions
type Predictions = {
    readonly results: string[][] | null; // Make prediction results as an array
    readonly error: string | undefined; // Make error as either a string or undefined (no error)
};


// Helper function to add error (results will be null)
const addError = (error: string): Predictions => ({
    results: null,
    error: error
});

// Name: predictSpending
// Author: Kristin Boeckmann
// Date: 04/27/2025
// Preconditions: email of the user
// Postconditions: Predictions result
export async function predictSpending(email: string): Promise<Predictions> {
    try {
        console.log('Fetching expenses...');
        const randomSalt = uuidv4(); // This is used to synchrosize access
        const result = await fetchExpenses(email, randomSalt); // Fetch expenses

        if (result.error !== undefined) {
            // If the error is not undefined, it means that there is an error that we need to show, return here
            return { results: null, error: result.error };
        }

        // Start making predictions
        return new Promise((resolve, reject) => {
            console.log('Running Python script...');


            const pythonProcess = spawn('python', ['ml/predict.py'], {
                cwd: undefined,
                env: {
                    // IDK why this should be needed but whatever
                    ...process.env,
                    // This is used to load and store csv and predictions
                    'summa_random_salt': randomSalt
                }
            });

            let data = '';
            pythonProcess.stdout.on('data', (chunk) => {
                data += chunk.toString();
            });

            pythonProcess.stderr.on('data', (chunk) => {
                console.error('Python stderr:', chunk.toString());
            });

            pythonProcess.on('close', (code) => {
                console.log(`Python script exited with code ${code}`);
                if (code === 0) {
                    try {
                        // Read the predicted data from the tmp directory
                        const rawData = readFileSync(`/tmp/${randomSalt}.json`).toString();
                        // Parse the data
                        const parsedData: string[][] = JSON.parse(rawData);
                        console.log(data);
                        // Resolve the promise with the parsed data
                        resolve({ results: parsedData, error: undefined });
                    } catch (error) {
                        // If there is an error in parsing, resolve with invalid json
                        console.error('Invalid JSON:', data);
                        resolve(addError('Failed to generate predictions.'));
                    }
                } else {
                    // Resolve with python script execution
                    resolve(addError('Python script execution failed.'));
                }
            });
        });
    } catch (error) {
        console.error('Error in predictSpending:', error);
        // Return this error when fetching expenses or generating predicitons failed
        return addError('Failed to fetch expenses or generate predictions.');
    }
}
