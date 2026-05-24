import type { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

let prismaPromise: Promise<PrismaClient> | undefined;

export async function getPrisma() {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (!prismaPromise) {
    prismaPromise = import('@prisma/client').then(({ PrismaClient }) => {
      const client = new PrismaClient({
        log: ['error', 'warn']
      });

      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = client;
      }

      return client;
    });
  }

  return prismaPromise;
}
