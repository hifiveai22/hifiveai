import { PrismaClient } from '@prisma/client'

type PrismaGlobal = {
  prisma?: PrismaClient
  prismaCacheKey?: string
}

const PRISMA_CACHE_KEY = 'onboarding-v3'

const globalForPrisma = globalThis as unknown as PrismaGlobal

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: ['query'],
  })
}

// If the cached PrismaClient was created with a different cache key
// (e.g. before a new model was added to the schema), discard it and
// create a fresh instance so the new model is available.
if (globalForPrisma.prisma && globalForPrisma.prismaCacheKey !== PRISMA_CACHE_KEY) {
  try {
    void globalForPrisma.prisma.$disconnect()
  } catch {
    // ignore disconnect errors
  }
  globalForPrisma.prisma = undefined
}

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrismaClient()
  globalForPrisma.prismaCacheKey = PRISMA_CACHE_KEY
}

export const db = globalForPrisma.prisma
