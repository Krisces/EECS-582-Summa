/**
Prologue:
Name of Program: utils/dbConfig.tsx
Description: Provides db config and connection.
Inputs: None
Outputs: Exports database connection made by drizzle.
Author: Kristin Boeckmann, Zach Alwin, Lisa Phan, Shravya Mehta, Vinayak Jha
Creation Date: 02/16/2025
*/

import dotenv from 'dotenv'; // Import dotenv
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Load environment variables from .env file
dotenv.config();

if (!process.env.NEXT_PUBLIC_DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
export const db = drizzle(sql, { schema });