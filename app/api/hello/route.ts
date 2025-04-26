// app/api/hello/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/utils/dbConfig'; // Import db
import { Categories, Expenses, Income } from '@/utils/schema'; // Import table definitions
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';  // Import sql operations

export async function GET() {

    const result = await db.select({
        totalExpenses: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number)
    }).from(Expenses).execute();

    console.log(result);
    const execSync = require('child_process').execSync;
    const output = execSync('ls', { encoding: 'utf-8' });

    return NextResponse.json({ message: 'Hello, world!', result, out: output });
}
