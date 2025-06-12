import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function getPrismaClient(): PrismaClient {
  if (global.prisma) {
    return global.prisma;
  }

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

export const prisma = getPrismaClient();
