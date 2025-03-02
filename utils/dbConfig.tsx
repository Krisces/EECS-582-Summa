/**
Prologue:
Name of Program: utils/dbConfig.tsx
Description: Provides db config and connection.
Inputs: None
Outputs: Exports database connection made by drizzle.
Author: Kristin Boeckmann, Zach Alwin, Lisa Phan, Shravya Mehta, Vinayak Jha
Creation Date: 02/16/2025
*/

// Import necessary libraries
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
// Import schema
import * as schema from './schema'

// Make sure the database url is set
if (!process.env.DATABASE_URL) {
    // Throw error if database url is not valid
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

// Make database connection
const sql = neon(process.env.DATABASE_URL);

// Setup drizzle ORM connection
export const db = drizzle(sql, { schema });