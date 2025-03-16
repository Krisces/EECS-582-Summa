/**
Prologue:
Name of Program: app/(routes)/dashboard/_components/CategoryStats.tsx
Description: Provides CategoryStats JSX Component. 
Inputs: None
Outputs: Exports CategoryStats component to display CategoryStats
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 03/09/2025
 */
"use client";
// Import React
import React from 'react';

// Define type
interface CategoryStatsProps {
  categoryList: any[];
  totalIncome: number;
}

// Name: Categories
// Author: Kristin Boeckmann
// Date: 03/09/2025
// Preconditions: categoryList, and total income (as defined in CategoryStatsProps)
// Postconditions: JSX Component to show the category stats
function CategoryStats({ categoryList, totalIncome }: CategoryStatsProps) {
  // Calculate progress percentage for each category
  const calculateProgressPerc = (totalSpend: number) => {
    if (totalIncome > 0) {
      const perc = (totalSpend / totalIncome) * 100;
      return perc.toFixed(2);
    }
    return '0.00'; // Default value when there is no income
  };

  return (
    <div className='w-full'>
      {categoryList.map((category) => {
        // Assign the budget amount
        const budgetAmount = category.budgetAmount !== null ? parseFloat(category.budgetAmount) : 0;
        // Assign the total expenses
        const totalSpend = category.totalExpenses ?? 0;
        // Compute the percentage for the progress bar
        const progressPercentage = calculateProgressPerc(totalSpend);

        return (
          <div key={category.id} className='mb-4 w-full'>
            <div className='flex items-center justify-between mb-1'>
              <div className='flex items-center mt-2'>
                <h2 className='text-xs p-1 px-2 bg-slate-100 rounded-full'>
                  {category.icon}
                </h2>
                <div className='pl-2'>
                  <h4 className='text-sm font-medium'>{category.name}</h4>
                </div>
              </div>
              <h4 className='text-sm font-medium text-violet-800'>
                ${totalSpend}
              </h4>
            </div>
            <div className='w-full bg-slate-300 h-1 rounded-full mt-2'>
              <div className='bg-violet-800 h-full rounded-full'
                style={{
                  width: `${progressPercentage}%`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Export CategoryStats
export default CategoryStats;