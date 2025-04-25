
// app/api/chat/route.ts
import { getAuth } from '@clerk/nextjs/server'; // Use Clerk's server-side utility
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/utils/dbConfig'; // Import your database instance
import { Expenses, Categories } from '@/utils/schema'; // Import your tables
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const clonedReq = req.clone();
    const { userId } = getAuth(new NextRequest(clonedReq));

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    // Fetch the user's expense data
    const expenses = await db
            .select({
              id: Expenses.id,
              name: Expenses.name,
              amount: Expenses.amount,
              createdAt: Expenses.createdAt,
              createdBy: Expenses.createdBy,
              categoryName: Categories.name, // Include category name if needed
            })
            .from(Expenses) // Start from Expenses to ensure all expenses are fetched
            .leftJoin(Categories, eq(Categories.id, Expenses.categoryId)) // Use leftJoin if you want all expenses
            .where(eq(Expenses.createdBy, 'lisaphan208@gmail.com')) // Ensure the user is the one who created the expenses
            .orderBy(desc(Expenses.id));

    // Analyze expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((expense) => {
      if (expense.categoryName) {
        categoryTotals[expense.categoryName] =
          (categoryTotals[expense.categoryName] || 0) + parseFloat(expense.amount);
      }
    });

    // Prepare expense summary for the AI
    const expenseSummary = `
      Total expenses: $${totalExpenses.toFixed(2)}.
      Spending by category: ${Object.entries(categoryTotals)
        .map(([category, amount]) => `${category}: $${amount.toFixed(2)}`)
        .join(', ')}.
      All individual expenses: ${expenses
        .map((expense) => `${expense.name}: $${expense.amount} on ${expense.createdAt}`)
        .join(', ')}.
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY!}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `You are a helpful budget assistant. Here is the user's expense data: ${expenseSummary}` },
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await response.json();

    console.log('OpenRouter response:', data); //debug line

    const reply = data.choices?.[0]?.message?.content || 'No reply from model.';
    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
