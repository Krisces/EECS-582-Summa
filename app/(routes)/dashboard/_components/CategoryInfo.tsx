/**
Prologue:
Name of Program: app/(routes)/dashboard/_components/CategoryInfo.tsx
Description: Provides CategoryInfo JSX Component. Wraps around CategoryStats and CategoryChart JSX Component
Inputs: None
Outputs: Exports CategoryInfo component to display information about a category
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 03/15/2025
 */
// Import Skeleton component
import { Skeleton } from '@/components/ui/skeleton';
// Import React
import React from 'react'
// Import CategoryStats component
import CategoryStats from './CategoryStats';
// Import CategoryChart component
import CategoryChart from './CategoryChart';

// Define CategoryInfo type
interface CategoryInfo {
  categoryList: any[]; // Adjust based on the shape of your category data
  totalIncome: number;
  loading: boolean;
}

// Name: CategoryInfo
// Author: Zach Alwin
// Date: 03/15/2025
// Preconditions: categoryList, and total income (as defined in CategoryStatsProps), and loading (whether it is loading or not)
// Postconditions: JSX Component to show the category info
const CategoryInfo = ({ categoryList, totalIncome, loading }: CategoryInfo) => (
  <div className="grid grid-cols-1 md:grid-cols-3 mx-10 my-5 gap-5">
    <div className="md:col-span-2 p-7 border rounded-lg flex flex-col h-auto">
      {loading ? (
        <Skeleton className="w-full h-86" />
      ) : (
        <CategoryStats categoryList={categoryList} totalIncome={totalIncome} />
      )}
    </div>
    <div className="p-7 border rounded-lg flex items-center h-auto">
      <CategoryChart categoryList={categoryList} />  {/* Pass category list to CategoryChart */}
    </div>
  </div>
);

// Export CategoryInfo component
export default CategoryInfo