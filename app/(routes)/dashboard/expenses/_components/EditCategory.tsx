"use client"

/**
 * Prologue
 * 
 * Name: EditCategories Component
 * Description: 
 * This component allows users to update a category's name, budget amount, and emoji icon.
 * It provides a dialog interface where users can edit the details of an existing category and update it in the database.
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Vinayak Jha, Zach Alwin, Shravya Matta
 * Date Created: 03/15/2025
 * Last Revised: N/A
 * Revision History: N/A
 *
 * Preconditions:
 * - The 'categoryInfo' prop must contain the data of the category being edited
 *
 * Acceptable Input:
 * - categoryInfo must be an object with valid category data
 *
 * Unacceptable Input:
 * - Invalid or empty 'categoryInfo'
 * - Non-numeric or empty input for 'budgetAmount'
 *
 * Postconditions:
 * - The category is updated in the database
 * - The category list is refreshed to reflect the changes
 * 
 * Error Handling:
 * - Database connection failure or invalid input will result in an error toast and the loading state is reset
 * - If the user inputs an invalid budgetAmount, the update will fail
 * 
 * Side Effects:
 * - A toast notification is shown to the user to indicate success or failure
 *
 * Invariants:
 * - The "Update Category" button is only enabled when the category name is not empty
 *
 * Known Faults: N/A
 */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PenBox } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react' // Imports emoji-picker for selecting emoji icons
import { useUser } from '@clerk/nextjs'
import { Categories } from '@/utils/schema'
import { db } from '@/utils/dbConfig'
import { eq } from 'drizzle-orm' // Imports equality function from drizzle-orm for query filtering
import { toast } from 'sonner' // Imports toast notification library

/*
 * Initializes the component's state variables using React's useState hook
 */
function EditCategory({ categoryInfo, refreshData }: any) {
    // Local state variables to store category data
    const [emojiIcon, setEmojiIcon] = useState('');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [loading, setLoading] = useState<boolean>(false); // Loading state for update process
    const [name, setName] = useState<string>(''); // Name of the category
    const [budgetAmount, setBudgetAmount] = useState<string>(''); // Budget amount for the category

    const { user } = useUser(); // Uses Clerk's useUser hook to get the user info

    // Side-effect for initializing component
    useEffect(() => {
        if (categoryInfo) {
            setEmojiIcon(categoryInfo?.icon);
            setBudgetAmount(categoryInfo.budgetAmount || ''); // Ensure default is empty string if budgetAmount is null
            setName(categoryInfo.name);
        }
    }, [categoryInfo]);
    
    /*
     * Update Category
     * It sends the updated data (name, budgetAmount, emojiIcon) to the database and refreshes 
     * the list of categories after a successful update
     */
    const onUpdateCategory = async () => {
        setLoading(true); // Start loading
        try {
            // Updates the category in the database
            const result = await db.update(Categories).set({
                name,
                budgetAmount: budgetAmount === '' ? null : budgetAmount, // Set to null if empty
                icon: emojiIcon
            }).where(eq(Categories.id, categoryInfo.id)) // Finds category by ID
            .returning();

            if (result) {
                refreshData(); // Refresh data if update is successful
                toast('Category Updated!');
            }
        } catch (error) {
            console.error('Error updating category:', error); // Logs error if update fails
            toast.error('Failed to update category. Please try again.');
        } finally {
            setLoading(false); // End loading
        }
    }
    
    /*
     * Dialog and Form Layout
     * Sets up IO of the form inside a modal dialog
     */ 
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='flex gap-2'> <PenBox />Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Category</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button variant="outline"
                                    className="text-lg"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                    {emojiIcon}
                                </Button>
                                <div className='absolute z-20'>
                                    <EmojiPicker
                                        open={openEmojiPicker} // Control visibility of emoji picker
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji); // Set emoji icon on selection
                                            setOpenEmojiPicker(false); // Close picker after selection
                                        }}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <h2 className='text-black font-medium my-1'>
                                        Category Name
                                    </h2>
                                    <Input
                                        type="string"
                                        placeholder='e.g. Groceries'
                                        value={name} // Binds input value to name state
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <h2 className='text-black font-medium my-1'>
                                        Budget Amount in $
                                    </h2>
                                    <Input
                                        type="number"
                                        placeholder='e.g. 600'
                                        value={budgetAmount} // Binds input value to budgetAmount state
                                        onChange={(e) => setBudgetAmount(e.target.value)}
                                    />
                                </div>

                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button disabled={!name} className='mt-6 w-full'
                                onClick={() => onUpdateCategory()}>
                                Update Category
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditCategory