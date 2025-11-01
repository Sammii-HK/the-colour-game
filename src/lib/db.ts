import { PrismaClient } from "@prisma/client";

// Initialize Prisma client only if DATABASE_URL is available
let prisma: PrismaClient;

const initializeDatabase = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not configured, database features disabled');
    return null;
  }
  
  try {
    const client = new PrismaClient();
    
    // Initialize posti-email with Prisma client only if available
    if (typeof require !== 'undefined') {
      try {
        const { setPrismaClient } = require("posti-email");
        setPrismaClient(client);
        console.log('posti-email initialized with database');
      } catch (err) {
        console.warn('posti-email not available or failed to initialize');
      }
    }
    
    return client;
  } catch (error) {
    console.warn('Database initialization failed:', error);
    return null;
  }
};

prisma = initializeDatabase() || {} as PrismaClient;

export { prisma };
