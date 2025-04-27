/**
Prologue:
Name of Program: app/(routes)/dashboard/data-insights/predictions.tsx
Description: Provides Predictions Chart JSX Component.
Inputs: None
Outputs: Exports Predictions Chart component to show the dashboard
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 04/27/2025
*/
"use client";
import React from "react"; // Import react
import { Bar, BarChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts"; // Import charts component
import { ChartConfig, ChartContainer } from "@/components/ui/chart"; // Import chart component


// Define month names (in order)
const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Name: convertDateToMonth
// Author: Vinayak Jha
// Date: 04/27/2025
// Preconditions: rawDate (as string, in ISO format)
// Postconditions: string (but prettified)
const convertDateToMonth = (rawDate: string) => {
    const split = rawDate.split("-"); // Split the date
    const month = split[1]; // We use ISO format (this is the month)
    const year = split[0]; // This is the year
    return `${monthNames[Number.parseInt(month) - 1]}\n(${year})`; // Return "MONTH (YEAR)"
}

// Name: PredictionsChart
// Author: Vinayak Jha
// Date: 04/27/2025
// Preconditions: predictions (as nested list of strings)
// Postconditions: JSX component for the chart
function PredictionsChart({ predictions }: { readonly predictions: string[][] }) {

    // Define the chart config
    const chartConfig = {
        "Prediction": {
            label: "Prediction",
            color: "#3498db"
        },
        "Prediction (Lower)": {
            label: "Prediction (Lower)",
            color: "#52be80"
        },
        "Prediction (Higher)": {
            label: "Prediction (Higher)",
            color: "#e74c3c"
        }
    }

    // Map the predictions
    const mappedPredictions = React.useMemo(() => predictions.map((row) => ({
        "Prediction": Number.parseFloat(row[0]).toFixed(2),
        "Prediction (Lower)": Number.parseFloat(row[1]).toFixed(2),
        "Prediction (Higher)": Number.parseFloat(row[2]).toFixed(2),
        "Month": convertDateToMonth(row[3])
    })), [predictions]);

    return (<ChartContainer className='min-h-[300px] h-[300px] w-full' config={chartConfig}>
        <div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mappedPredictions}>
                    <XAxis
                        dataKey="Month"
                        label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis />
                    <Tooltip
                        formatter={(value, name) => {
                            return [`$${value}`, name];
                        }}
                    />
                    <Bar dataKey="Prediction (Lower)" fill={chartConfig["Prediction (Lower)"].color} radius={4} />
                    <Bar dataKey="Prediction" fill={chartConfig["Prediction"].color} radius={4} />
                    <Bar dataKey="Prediction (Higher)" fill={chartConfig["Prediction (Higher)"].color} radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </ChartContainer>)

}

// Export PredictionsChart
export default PredictionsChart;