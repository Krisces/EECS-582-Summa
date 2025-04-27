/** Prologue
 * AddExpense Component
 * 
 * This React component allows users to add a new expense by providing a name, amount, category, and transaction date.
 * The expense data is stored in the database and a refresh function is called to update the UI.
 * 
 * Programmer: Kristin Boeckmann, Zach Alwin, Shravya Mehta, Lisa Phan, Vinayak Jha
 * Created Date: 02/25/2025
 * 
 * Revisions:
 * - N/A
 * 
 * Preconditions:
 * - User must be authenticated.
 * - Database connection must be properly configured.
 * 
 * Acceptable Inputs:
 * - Name: A string representing the expense name (e.g., 'Walmart').
 * - Amount: A number representing the expense cost (e.g., '50').
 * - Category: A selected category from the list.
 * - Transaction Date: A valid date selected from the date picker.
 * 
 * Postconditions:
 * - The new expense is added to the database.
 * - The UI is refreshed to reflect the new expense.
 * - A success toast message is displayed.
 * 
 * Error Handling:
 * - If fetching categories fails, an error is logged to the console.
 * - If required fields are missing, the submit button is disabled.
 * - If database insertion fails, an error message could be added (not implemented here).
 * 
 * Side Effects:
 * - Reads from and writes to the database.
 * - Displays a toast notification.
 * 
 * Invariants:
 * - User and category data are expected to be defined when used.
 * - Component assumes that db, Categories, and Expenses are correctly imported and configured.
 * 
 * Known Faults: N/A
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Categories, Expenses } from '@/utils/schema';
import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { toast } from 'sonner';
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePicker } from "@/components/ui/DatePicker";
import moment from 'moment';
import { eq } from 'drizzle-orm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AddExpenseProps {
  categoryId: string; // Passed as a string from parent
  user: any; // Adjust type as necessary
  refreshData: any;
}

// Define recurring options
const recurringOptions = [
  { value: "none", label: "One-time" },
  { value: "weekly", label: "Weekly", instances: 104 }, // 2 years × 52 weeks
  { value: "biweekly", label: "Every 2 weeks", instances: 52 }, // 2 years × 26 biweekly periods
  { value: "monthly", label: "Monthly", instances: 24 }, // 2 years × 12 months
  { value: "yearly", label: "Yearly", instances: 2 }, // 2 years
];

function AddExpense({ categoryId, user, refreshData }: AddExpenseProps) {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [categories, setCategories] = useState<{ value: string; label: string; icon: string }[]>([]); // Categories for dropdown
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(undefined); // Selected date
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Selected category ID
  const [open, setOpen] = useState(false); // Dropdown popover state
  
  // New state for recurring options
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurringType, setRecurringType] = useState<string>("none");

  useEffect(() => {
    // Fetch categories from the database
    const fetchCategories = async () => {
      try {
        const result = await db.select().from(Categories).where(eq(Categories.createdBy, user?.primaryEmailAddress?.emailAddress));
        const categoryOptions = result.map((category) => ({
          value: category.id.toString(),
          label: category.name,
          icon: category.icon || "",  // Ensure you have an icon URL or class here
        }));
        setCategories(categoryOptions);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, [user?.primaryEmailAddress?.emailAddress]);

  // Generate future dates based on recurring type
  const generateFutureDates = (startDate: Date, recurringType: string): Date[] => {
    const dates: Date[] = [];
    const option = recurringOptions.find(opt => opt.value === recurringType);
    
    if (!option || recurringType === "none") {
      return [startDate];
    }
    
    const instances = option.instances || 1; 
    const date = new Date(startDate);
    
    for (let i = 0; i < instances; i++) {
      // Clone the date to avoid modifying the original
      const newDate = new Date(date);
      dates.push(newDate);
      
      // Increment date based on recurring type
      switch (recurringType) {
        case "weekly":
          date.setDate(date.getDate() + 7);
          break;
        case "biweekly":
          date.setDate(date.getDate() + 14);
          break;
        case "monthly":
          date.setMonth(date.getMonth() + 1);
          break;
        case "yearly":
          date.setFullYear(date.getFullYear() + 1);
          break;
        default:
          break;
      }
    }
    
    return dates;
  };

  const addNewExpense = async () => {
    if (!transactionDate) {
      toast.error('Please select a transaction date');
      return;
    }

    const categoryIdInt = parseInt(selectedCategory, 10); // Converts category to number
    
    try {
      // Generate dates based on recurring settings
      const dates = isRecurring && recurringType !== "none" 
        ? generateFutureDates(transactionDate, recurringType)
        : [transactionDate];
      
      // Create an expense entry for each date
      const insertPromises = dates.map(date => {
        const formattedDate = moment(date).format('MM-DD-YYYY');
        
        return db.insert(Expenses).values({
          name: name,
          amount: amount,
          categoryId: categoryIdInt,
          createdAt: formattedDate,
          createdBy: user?.primaryEmailAddress?.emailAddress as string,
        });
      });
      
      await Promise.all(insertPromises);
      
      refreshData();
      
      if (isRecurring && recurringType !== "none") {
        const option = recurringOptions.find(opt => opt.value === recurringType);
        toast.success(`Created ${option?.instances} ${recurringType} expenses over the next 2 years`);
      } else {
        toast.success('New Expense Added!');
      }
      
      // Reset form
      setName('');
      setAmount('');
      setTransactionDate(undefined);
      setIsRecurring(false);
      setRecurringType("none");
    } catch (error) {
      console.error("Failed to add expense:", error);
      toast.error('Failed to add expense. Please try again.');
    }
  };

  // JSX return
  return (
    <div className='border p-5 rounded-lg'>
      <h2 className='font-bold text-lg'>
        Add Expense
      </h2>
      <div className='mt-3'>
        <h2 className='text-black font-medium my-1'>
          Expense Name
        </h2>
        <Input
          type="string"
          placeholder='e.g. Walmart'
          value={name}
          onChange={(e) => { setName(e.target.value) }}
        />
      </div>
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
              className="w-full justify-between"
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
      <div className='mt-3'>
        <h2 className='text-black font-medium my-1'>
          Expense Amount
        </h2>
        <Input
          type="number"
          placeholder='e.g. 50'
          value={amount}
          onChange={(e) => { setAmount(e.target.value) }}
        />
      </div>
      <div className='mt-3'>
        <h2 className='text-black font-medium my-1'>
          Transaction Date
        </h2>
        <DatePicker onDateChange={setTransactionDate} />
      </div>
      
      {/* Recurring expense options */}
      <div className='mt-3 flex items-center space-x-2'>
        <Checkbox 
          id="is-recurring" 
          checked={isRecurring}
          onCheckedChange={(checked) => {
            setIsRecurring(checked === true);
            if (checked === false) {
              setRecurringType("none");
            }
          }}
        />
        <Label htmlFor="is-recurring">Make this a recurring expense</Label>
      </div>
      
      {isRecurring && (
        <div className='mt-2'>
          <h2 className='text-black font-medium my-1'>
            Recurrence Pattern
          </h2>
          <Select
            value={recurringType}
            onValueChange={setRecurringType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {recurringOptions.slice(1).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {recurringType !== "none" && (
            <p className='text-xs text-gray-500 mt-1'>
              This will create {recurringOptions.find(opt => opt.value === recurringType)?.instances} 
              {' '}{recurringType} expenses over the next 2 years.
            </p>
          )}
        </div>
      )}
      
      <Button 
        disabled={!(name && amount && selectedCategory && transactionDate && (isRecurring ? recurringType !== "none" : true))}
        onClick={() => addNewExpense()}
        className='mt-4 w-full'
      >
        {isRecurring ? 'Add Recurring Expenses' : 'Add New Expense'}
      </Button>
    </div>
  );
}

export default AddExpense;