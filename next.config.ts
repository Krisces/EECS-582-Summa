import type { NextConfig } from "next";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
};

export default nextConfig;
