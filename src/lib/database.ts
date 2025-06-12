import { PrismaClient } from '@prisma/client';

function createPrismaClient(): PrismaClient {
  try {
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  } catch {
    return new PrismaClient();
  }
}

export const getPrismaClient = createPrismaClient();
