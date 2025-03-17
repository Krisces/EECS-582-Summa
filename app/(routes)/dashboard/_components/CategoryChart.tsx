/**
Prologue:
Name of Program: app/(routes)/dashboard/_components/CategoryChart.tsx
Description: Provides CategoryChart JSX Component.
Inputs: None
Outputs: Exports CategoryChart component to display the chart
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 03/09/2025
 */
"use client";
// Import React
import React from 'react';
// Import Doughnut for the chart
import { Doughnut } from 'react-chartjs-2';
// Import various components for the chart
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register the components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Define the typs
interface CategoryChartProps {
  categoryList: {
    name: string;           // Name of the category
    totalExpenses: number;  // Total expenses
  }[];
}

// Name: CategoryChart
// Author: Shravya Mehta
// Date: 03/09/2025
// Preconditions: categoryList
// Postconditions: JSX Component to show the chart
const CategoryChart: React.FC<CategoryChartProps> = ({ categoryList }) => {
  // Calculate total expenses
  const totalExpenses = categoryList.reduce((sum, category) => sum + (category.totalExpenses || 0), 0);

  // Define an array of colors for the chart
  const colors = [
    '#a569bd', '#5dade2', '#48c9b0', '#58d68d', '#f4d03f',
    '#f0b27a', '#ec7063', '#d7bde2', '#45b39d', '#f0b27a'
  ];

  // Prepare data for the chart
  const data = {
    labels: categoryList.map(category => category.name),
    datasets: [
      {
        label: 'Expense Distribution',
        data: categoryList.map(category => (category.totalExpenses || 0)),
        backgroundColor: colors.slice(0, categoryList.length), // Assign different colors to each segment
        borderColor: '#ffffff', // Border color of segments
        borderWidth: 1,
      }
    ]
  };

  // Options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw;
            const percentage = totalExpenses > 0 ? (value / totalExpenses * 100).toFixed(2) : '0.00';
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-[320px] flex items-center justify-center">  {/* Flexbox to center the chart */}
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Export the CategoryChart components
export default CategoryChart;