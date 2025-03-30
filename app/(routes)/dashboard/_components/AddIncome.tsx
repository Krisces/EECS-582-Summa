"use client"
/**
 * Prologue
 * 
 * Name: AddIncome Component
 * Description: The component allows users to add a new income. 
 * It provides a form within a dialog modal to input the income name, amount, and transaction date.
 * 
 * Author: Kristin Boeckmann, Lisa Phan, Vinayak Jha, Zach Alwin, Shravya Matta
 * Date Created: 03/09/2025
 * Last Revised: N/A
 * Revision History: N/A
 *
 * Preconditions:
 * - User must be logged in.
 * - dbConfig must be properly set up.
 *
 * Acceptable Input:
 * - Name: Non-empty string.
 * - Amount: Numeric value.
 * - Transaction Date: A valid date selection.
 *
 * Unacceptable Input:
 * - Empty name or amount fields.
 * - Non-numeric values in the amount field.
 * - Invalid transaction date.
 *
 * Postconditions:
 * - A new income record is inserted into the database.
 * - The UI refreshes to reflect the added income entry.
 *
 * Error Handling:
 * - If the database insertion fails, an error message will be logged.
 *
 * Side Effects:
 * - State updates for input fields and transaction date.
 * - Database modification.
 * - UI updates (dialog modal and refresh trigger).
 *
 * Invariants:
 * - The function should only execute if the user is authenticated.
 * - The transaction date need to be formatted correctly.
 *
 * Known Faults: N/A
 */
import * as React from "react"
import { useState } from 'react' // useState hook for managing component state
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog" // Imports UI components for dialog/modal
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { db } from '@/utils/dbConfig';
import { Income } from '@/utils/schema';
import { DatePicker } from "@/components/ui/DatePicker"
import moment from 'moment';
import { toast } from "sonner"

function AddIncome({refreshData}:any) {

    const [name, setName] = useState<string>(''); // Stores name of the income source
    const [amount, setAmount] = useState<string>(''); // Stores income
    const [transactionDate, setTransactionDate] = useState<Date | undefined>(undefined); // Stores transaction date
    const { user } = useUser(); // Retrieves user details from Clerk

    /**
     * User to Create New Income
     * - Checks if a user is logged in.
     * - Inserts data into the database
     */
    const onAddIncome = async () => {
        if (user) {
            // Format the date as MM-DD-YYYY
            const formattedDate = transactionDate ? moment(transactionDate).format('MM-DD-YYYY') : '';

            // Insert new income data into the database
            const result = await db.insert(Income).values({
                name: name, // Income source name
                amount: amount, //Income amount
                transactionDate: formattedDate, // Formatted date 
                createdBy:user?.primaryEmailAddress?.emailAddress as string, // User's email
            }).returning({ insertedId: Income.id });

            console.log("Income added with ID:", result); // Log new entry ID
            // If insertion is successful, refresh UI and show a toast message
            if (result) {
                refreshData();
                toast('New Income Added!');
              }
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div>
                        <Button>Add Income</Button>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Income</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'> {/* Input field for income name */}
                                <div className='mt-3'>
                                    <h2 className='text-black font-medium my-1'>
                                        Income Name
                                    </h2>
                                    <Input
                                        type="string"
                                        placeholder='Work'
                                        onChange={(e) => { setName(e.target.value) }}
                                    />
                                </div>
                                <div className='mt-3'> {/* Input field for income amount */}
                                    <h2 className='text-black font-medium my-1'>
                                        Income Amount in $
                                    </h2>
                                    <Input
                                        type="number"
                                        placeholder='e.g. 600'
                                        onChange={(e) => { setAmount(e.target.value) }}
                                    />
                                </div>
                                <div className='mt-3'> {/* Date Picker for transaction date */}
                                    <h2 className='text-black font-medium my-1'>
                                        Transaction Date
                                    </h2>
                                    <DatePicker
                                        onDateChange={setTransactionDate}
                                    />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button
                                disabled={!(name && amount && transactionDate)} // Disable if fields are empty
                                className='mt-6 w-full'
                                onClick={() => onAddIncome()}
                            >
                                Add Income
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddIncome