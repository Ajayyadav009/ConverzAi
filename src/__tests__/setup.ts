import { beforeEach, vi } from 'vitest';

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

// Mock environment variables
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';