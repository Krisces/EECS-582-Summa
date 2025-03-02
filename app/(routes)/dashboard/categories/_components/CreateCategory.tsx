"use client"
/**
Prologue:
Name of Program: app/(routes)/dashboard/categories/_components/CreateCategory.tsx
Description: Provides CreateCategory JSX component.
Inputs: None
Outputs: Exports CreateCategory JSX component to display create category component
Author: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
Creation Date: 02/26/2025
*/

// Import React and used hooks
import React, { useState } from 'react'
// Import Dialog components
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
// Import EmojiPicker component
import EmojiPicker from 'emoji-picker-react'
// Import Button component
import { Button } from '@/components/ui/button'
// Import Input component
import { Input } from '@/components/ui/input'
// Import Categories table
import { Categories } from '@/utils/schema'
// Import useUser hook
import { useUser } from '@clerk/nextjs'
// Import db connection
import { db } from '@/utils/dbConfig'
// Import toast
import { toast } from 'sonner'

// Name: CategoryList
// Author: Lisa Phan
// Date: 02/26/2025
// Preconditions: function to refreshData
// Postconditions: JSX Component to show the create category
function CreateCategory({ refreshData }: any) {

    // Define emojiIcon state
    const [emojiIcon, setEmojiIcon] = useState('😃');
    // Define openEmojiPicker state 
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    // Define name state
    const [name, setName] = useState<string>('');
    // Define budgetAmount state
    const [budgetAmount, setAmount] = useState<string | null>(null);

    // Get the user
    const { user } = useUser();

    /**
     * User to Create New Category
     */
    const onCreateCategory = async () => {
        // Insert into a category
        const result = await db.insert(Categories)
            .values({
                name: name,
                createdBy: user?.primaryEmailAddress?.emailAddress as string,
                icon: emojiIcon,
                budgetAmount: budgetAmount,
            }).returning({ insertedId: Categories.id })

        if (result) {
            // Refresh data
            refreshData()
            toast('New Category Created!')
        }
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md h-[170px]'>
                        <h2 className='text-3xl'>+</h2>
                        <h2>Create Categories</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button variant="outline"
                                    className="text-lg"
                                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                    {emojiIcon}
                                </Button>
                                <div className='absolute z-20'>
                                    <EmojiPicker
                                        open={openEmojiPicker}
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji)
                                            setOpenEmojiPicker(false)
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
                                        onChange={(e) => { setName(e.target.value) }}
                                    />
                                </div>
                                <div className='mt-3'>
                                    <h2 className='text-black font-medium my-1'>
                                        Budget Amount in $
                                    </h2>
                                    <Input
                                        type="number"
                                        placeholder='e.g. 600'
                                        onChange={(e) => {
                                            setAmount(e.target.value)
                                        }}
                                    />
                                </div>

                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button disabled={!(name)} className='mt-6 w-full'
                                onClick={() => onCreateCategory()}>
                                Create Category
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    )
}

// Export CreateCategory component
export default CreateCategory