import { PrismaClient } from "@prisma/client";
import { setPrismaClient } from "posti-email";

// Initialize Prisma client only if DATABASE_URL is available
let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
  // Initialize posti-email with our Prisma client
  setPrismaClient(prisma);
} catch (error) {
  console.warn('Database not configured, some features may be limited');
  // Create a mock prisma for build time
  prisma = {} as PrismaClient;
}

export { prisma };
