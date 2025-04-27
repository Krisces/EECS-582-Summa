/**
Prologue:
Name of Program: app/(routes)/dashboard/data-insights/page.tsx
Description: Provides main component for data-insights.
Inputs: None
Outputs: Exports AnalysisPage component to show the  data-insights.
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 04/27/2025
*/
'use client';
import { useState } from 'react'; // Import useState hook
import { useUser } from '@clerk/nextjs'; // Import the useUser hook
import { predictSpending } from '../actions'; // Import predictSpending function
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import PredictionsChart from "./predictions"; // Import PredictionsChart component

// Name: AnalysisPage
// Author: Vinayak Jha
// Date: 04/27/2025
// Preconditions: None
// Postconditions: Analyis Page component
export default function AnalysisPage() {
    const [predictions, setPredictions] = useState<string[][] | null>(null); // Define the predictions
    const [isLoading, setIsLoading] = useState(false); // Define isLoading state (for showing loading)
    const [error, setError] = useState<string | null>(null); // Define rror state
    const { user } = useUser(); // Get the current user

    const handlePredict = async () => {
        setIsLoading(true); // Set loading to true
        setError(null); // Set error to null
        try {
            if (!user) {
                // If user is not available, not authenticated
                throw new Error('User not authenticated.');
            }

            const email = user.primaryEmailAddress?.emailAddress; // Get the user's email
            if (!email) {
                // If email is undefined, throw another error
                throw new Error('User email not found.');
            }

            console.log('Fetching predictions for user:', email);

            const predictionsData = await predictSpending(email); // Pass the email and fetch predictions
            console.log('Predictions:', predictionsData); // Log the predictions
            if (predictionsData.error) {
                // Set state with the correct type
                setError(predictionsData.error);
            } else {
                // Set the predictions
                setPredictions(predictionsData.results);
            }
        } catch (error) {
            console.error('Error fetching predictions:', error);
            setError('Failed to fetch predictions. Please try again.'); // Set the error if fetching predictions failed
        } finally {
            setIsLoading(false); // Finally, set the loading to false
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Spending Predictions</h1>
            <button
                onClick={handlePredict}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
                {isLoading ? "Loading..." : "Predict Spending"}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {isLoading === true ? <Skeleton className="w-full h-[300px]" /> : predictions &&
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Predictions</h2>
                    <PredictionsChart predictions={predictions} />
                </div>
            }

            {/* {predictions && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Predictions</h2>
                    <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(predictions, null, 2)}</pre>
                </div>
            )} */}
        </div>
    );
}
