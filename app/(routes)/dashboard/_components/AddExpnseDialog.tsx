"use client" // Enables client-side rendering for Next.js

import * as React from "react"
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'; // Importing authentication hook from Clerk
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog" // Importing UI components for modal dialogs
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command" // Importing command UI components
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover" // Importing popover components for dropdown selection
import { Input } from '@/components/ui/input'
import { Check, ChevronsUpDown } from "lucide-react" // Icons for UI enhancements
import { Button } from '@/components/ui/button';
import { db } from '@/utils/dbConfig'; // Database configuration import
import { Categories, Expenses } from '@/utils/schema'; // Importing schema for database tables
import { DatePicker } from "@/components/ui/DatePicker" // Date picker component
import moment from 'moment'; // Moment.js for date formatting
import { cn } from "@/lib/utils" // Utility functions
import { toast } from "sonner" // Toast notifications

function AddExpenseDialog({ refreshData }: any) {
    const [name, setName] = useState<string>(''); // State for expense name
    const [amount, setAmount] = useState<string>(''); // State for expense amount
    const [categories, setCategories] = useState<{ value: string; label: string; icon: string }[]>([]); // State for available categories
    const [transactionDate, setTransactionDate] = useState<Date | undefined>(undefined); // State for transaction date
    const [selectedCategory, setSelectedCategory] = useState<string>(''); // State for selected category
    const [open, setOpen] = useState(false); // State to control popover open/close
    const { user } = useUser(); // Retrieves user information from Clerk authentication

    React.useEffect(() => {
        // Fetch categories from the database when component mounts
        const fetchCategories = async () => {
            try {
                const result = await db.select().from(Categories);
                const categoryOptions = result.map((category) => ({
                    value: category.id.toString(),
                    label: category.name,
                    icon: category.icon || "", // Ensures an icon exists
                }));
                setCategories(categoryOptions);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const addNewExpense = async () => {
        if (user) {
            const categoryIdInt = parseInt(selectedCategory, 10); // Convert category ID to integer

            // Format the transaction date as MM-DD-YYYY
            const formattedDate = transactionDate ? moment(transactionDate).format('MM-DD-YYYY') : '';

            const result = await db.insert(Expenses).values({
                name: name,
                amount: amount,
                categoryId: categoryIdInt,
                createdAt: formattedDate, // Use the formatted date
                createdBy: user?.primaryEmailAddress?.emailAddress as string, // Store user email
            }).returning({ insertedId: Expenses.id });

            console.log(result);
            if (result) {
                refreshData(); // Refresh data after inserting a new expense
                toast('New Expense Added!'); // Show success notification
            }
        }
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div>
                        <Button>Add Expense</Button>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                {/* Expense Name Input */}
                                <div className='mt-3'>
                                    <h2 className='text-black font-medium my-1'>
                                        Expense Name
                                    </h2>
                                    <Input
                                        type="string"
                                        placeholder='Work'
                                        onChange={(e) => { setName(e.target.value) }}
                                    />
                                </div>
                                {/* Expense Category Selection */}
                                <div>
                                    <h2 className='text-black font-medium my-1'>
                                        Expense Category
                                    </h2>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-[200px] justify-between"
                                            >
                                                {selectedCategory
                                                    ? categories.find((category) => category.value === selectedCategory)?.label
                                                    : "Select category..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Search category..." />
                                                <CommandList>
                                                    <CommandEmpty>No category found.</CommandEmpty>
                                                    <CommandGroup>
                                                        {categories.map((category) => (
                                                            <CommandItem
                                                                key={category.value}
                                                                value={category.value}
                                                                onSelect={(currentValue) => {
                                                                    setSelectedCategory(currentValue === selectedCategory ? "" : currentValue);
                                                                    setOpen(false);
                                                                }}
                                                            >
                                                                {category.icon}
                                                                {category.label}
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto h-4 w-4",
                                                                        selectedCategory === category.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {/* Expense Amount Input */}
                                <div className='mt-3'>
                                    <h2 className='text-black font-medium my-1'>
                                        Income Amount in $
                                    </h2>
                                    <Input
                                        type="number"
                                        placeholder='e.g. 600'
                                        onChange={(e) => { setAmount(e.target.value) }}
                                    />
                                </div>
                                {/* Transaction Date Picker */}
                                <div className='mt-3'>
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
                                disabled={!(name && amount && transactionDate)}
                                className='mt-6 w-full'
                                onClick={() => addNewExpense()}
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

export default AddExpenseDialog
