import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

// SQLite 클라이언트 생성
const libsql = createClient({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
});

// Prisma 어댑터 생성
const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL || 'file:./prisma/dev.db' });

// PrismaClient 싱글톤 패턴
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
