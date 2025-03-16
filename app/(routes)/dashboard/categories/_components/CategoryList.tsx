"use client"

/**
Prologue:
Name of Program: app/(routes)/dashboard/categories/_components/CategoryList.tsx
Description: Provides CategoryList JSX component.
Inputs: None
Outputs: Exports CategoryList JSX component to display multiple categories
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 02/26/2025
*/

// Import React and used hooks
import React, { useEffect, useState } from 'react'
// Import CreateCategory
import CreateCategory from './CreateCategory'
// Import db connection
import { db } from '@/utils/dbConfig'
// Import SQL functions
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
// Import tables
import { Categories, Expenses } from '@/utils/schema'
// Import useUser hook
import { useUser } from '@clerk/nextjs'
// Import CategoryItem
import CategoryItem from './CategoryItem'

// Name: CategoryList
// Author: Shravya Mehta
// Date: 02/26/2025
// Preconditions: None
// Postconditions: JSX Component to show the categories
function CategoryList() {

  // Define categoryList state
  const [categoryList, setCategoryList] = useState<any[]>([]);
  // Use user hook
  const { user } = useUser();
  // Setup useEffect and get the categories
  useEffect(() => {
    // If the user is defined, get the categories
    user && getCategoryList();
  }, [user])

  /**
   * Used to get category list
   */
  const getCategoryList = async () => {

    // Construct the sql query to get the categories
    const result = await db.select({
      ...getTableColumns(Categories),
      totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    })
      .from(Categories)
      .leftJoin(Expenses, eq(Categories.id, Expenses.categoryId))
      .where(eq(Categories.createdBy, user?.primaryEmailAddress?.emailAddress as string))
      .groupBy(Categories.id)
      .orderBy(desc(Categories.id))

    console.log(result); // Debugging output

    // Set the category list
    setCategoryList(result);
  }

  // Return the JSX
  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateCategory refreshData={() => getCategoryList()} />
        {categoryList?.length > 0 ? categoryList.map((category, index) => (
          <CategoryItem category={category} key={index} />
        ))
          : [1, 2, 3, 4, 5].map((item, index) => (
            <div key={index} className='w-full bg-slate-200 rounded-lg h-[170px] animate-pulse'></div>
          ))
        }
      </div>
    </div>
  );

}

// Export CategoryList component
export default CategoryList