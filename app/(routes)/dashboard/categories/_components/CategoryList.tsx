"use client";

/**
 * Prologue:
 * Name of Program: app/(routes)/dashboard/categories/_components/CategoryList.tsx
 * Description: Provides CategoryList JSX component.
 * Inputs: None
 * Outputs: Exports CategoryList JSX component to display multiple categories
 * Author: Kristin Boeckmann, Zach Alwin, Shravya Matta, Lisa Phan, Vinayak Jha
 * Creation Date: 02/26/2025
 */

import React, { useEffect, useState } from 'react';
import CreateCategory from './CreateCategory';
import { db } from '@/utils/dbConfig';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { Categories, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import CategoryItem from './CategoryItem';
import { useDateRange } from '@/context/DateRangeContext';
import moment from 'moment';

function CategoryList() {
  const [categoryList, setCategoryList] = useState<any[]>([]); // Store categories with totals
  const { user } = useUser(); // Get current user
  const { dateRange } = useDateRange(); // Get selected date range

  // Fetch categories whenever user or date range changes
  useEffect(() => {
    if (user) getCategoryList(dateRange);
  }, [user, dateRange]);

  // Fetch categories once on component mount
  useEffect(() => {
    if (user) getCategoryList(dateRange);
  }, []);

  // Fetch user's categories and attach expense totals
  const getCategoryList = async (dateRange: { from: Date; to: Date }) => {
    const formattedFromDate = moment(dateRange.from).format('MM-DD-YYYY');
    const formattedToDate = moment(dateRange.to).format('MM-DD-YYYY');

    // Get all categories created by the user
    const categories = await db
      .select({ ...getTableColumns(Categories) })
      .from(Categories)
      .where(eq(Categories.createdBy, user?.primaryEmailAddress?.emailAddress as string))
      .orderBy(desc(Categories.id));

    // For each category, fetch expenses within the date range
    const categoriesWithExpenses = await Promise.all(
      categories.map(async (category) => {
        const expenses = await db
          .select({ amount: Expenses.amount })
          .from(Expenses)
          .where(
            sql`${Expenses.categoryId} = ${category.id}
              AND ${Expenses.createdAt} >= ${formattedFromDate}
              AND ${Expenses.createdAt} <= ${formattedToDate}`
          )
          .execute();

        // Calculate total amount spent and number of items
        const totalSpend = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const totalItem = expenses.length;

        return { ...category, totalSpend, totalItem };
      })
    );

    setCategoryList(categoriesWithExpenses); // Update UI with processed data
  };

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {/* Component to add a new category */}
        <CreateCategory refreshData={() => getCategoryList(dateRange)} />

        {/* Show categories or loading skeletons */}
        {categoryList?.length > 0
          ? categoryList.map((category, index) => (
              <CategoryItem category={category} key={index} />
            ))
          : [1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className='w-full bg-slate-200 rounded-lg h-[170px] animate-pulse'></div>
            ))}
      </div>
    </div>
  );
}

export default CategoryList;
