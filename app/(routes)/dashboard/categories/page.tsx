/**
Prologue:
Name of Program: app/(routes)/dashboard/categories/page.tsx
Description: Provides Categories JSX component. Wrapper around CategoriesList
Inputs: None
Outputs: Exports Categories JSX component
Author: Kristin Boeckmann, Zach Alwin, Lisa Phan, Shravya Mehta, Vinayak Jha
Creation Date: 02/26/2025
*/

// Import React
import React from 'react'
// Import CategoryList component
import CategoryList from './_components/CategoryList'

// Name: Categories
// Author: Kristin
// Date: 02/26/2025
// Preconditions: None
// Postconditions: JSX Component which wraps CategoryList with styling and labels
function Catgories() {
  return (
    <div className='p-10'>
      <title>Summa Categories</title>
      <h2 className='font-bold text-3xl'>
        My Categories
      </h2>
      <CategoryList />
    </div>
  )
}

// Export Categories
export default Catgories