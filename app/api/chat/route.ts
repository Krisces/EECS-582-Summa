
// app/api/chat/route.ts
import { getAuth } from '@clerk/nextjs/server'; // Use Clerk's server-side utility
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/utils/dbConfig'; // Import database instance
import { Expenses, Categories, Income} from '@/utils/schema'; // Import tables
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';



export async function POST(req: Request) {
  try {
    // Clone the request to avoid mutating the original request
    // and extract the user ID from the request headers
    const clonedReq = req.clone();
    const res = getAuth(new NextRequest(clonedReq));

    const userId = res.userId;
    // Check if userId is available
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { message, email } = await req.json();
    // Check if message and email are provided
    if (!message) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'No email provided' }, { status: 400 });
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
      .where(eq(Expenses.createdBy, email)) // Ensure the user is the one who created the expenses
      .orderBy(desc(Expenses.id));

      const incomes = await db
      .select({
        id: Income.id,
        name: Income.name,
        amount: Income.amount,
        createdBy: Income.createdBy,
      })
      .from(Income)
      .where(eq(Income.createdBy, email))
      .orderBy(desc(Income.id));

    // Analyze expenses
    // Calculate total expenses and spending by category
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((expense) => {
      if (expense.categoryName) {
        categoryTotals[expense.categoryName] =
          (categoryTotals[expense.categoryName] || 0) + parseFloat(expense.amount);
      }
    });

    // Prepare expense summary for the AI
    const financeSummary = `
      Total income: $${totalIncome.toFixed(2)}.
      All individual incomes:
      ${incomes.map((income) => `- ${income.name}: $${income.amount}`).join('\n')}
      Total expenses: $${totalExpenses.toFixed(2)}.
      Spending by category:
      ${Object.entries(categoryTotals)
      .map(([category, amount]) => `- ${category}: $${amount.toFixed(2)}`)
      .join('\n')}
    `;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY!}`,
      },
      // Use the expense summary in the system message
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: `You are a helpful budget assistant. Here is the user's expense data: ${financeSummary}` },
          { role: 'user', content: message },
        ],
      }),
    });
    // Check if the response is ok
    const data = await response.json();

    console.log('OpenRouter response:', data); //debug line

    const reply = data.choices?.[0]?.message?.content || 'No reply from model.'; // Get the reply from the AI
    return NextResponse.json({ message: reply }); // Return the AI's reply
  } catch (error) { // Handle errors
    console.error('API Error:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 }); // Return a 500 error response
  }
}