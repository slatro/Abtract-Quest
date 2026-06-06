import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  db = new PrismaClient({
    adapter,
  });
} else {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["error"],
    });
  }
  db = globalForPrisma.prisma;
}
