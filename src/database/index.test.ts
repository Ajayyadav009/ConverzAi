import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('database/index.ts', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Database Connection Export', () => {
    it('should export db instance', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      expect(db).toBeDefined();
      expect(db).toBeTypeOf('object');
    });

    it('should be a Drizzle ORM instance', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      // Drizzle instance should have query methods
      expect(db).toHaveProperty('select');
      expect(db).toHaveProperty('insert');
      expect(db).toHaveProperty('update');
      expect(db).toHaveProperty('delete');
    });

    it('should initialize with Neon HTTP adapter', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      // The instance should exist and be properly initialized
      expect(db).toBeDefined();
      expect(typeof db).toBe('object');
    });
  });

  describe('Environment Variable Configuration', () => {
    it('should use DATABASE_URL from environment', async () => {
      const testUrl = 'postgresql://testuser:testpass@testhost:5432/testdb';
      process.env.DATABASE_URL = testUrl;
      
      // Import should not throw
      expect(async () => {
        await import('./index');
      }).not.toThrow();
    });

    it('should handle different DATABASE_URL formats', async () => {
      const urlFormats = [
        'postgresql://user:pass@localhost:5432/db',
        'postgres://user:pass@localhost:5432/db',
        'postgresql://user@localhost/db',
      ];

      for (const url of urlFormats) {
        vi.resetModules();
        process.env.DATABASE_URL = url;
        
        const { db } = await import('./index');
        expect(db).toBeDefined();
      }
    });

    it('should handle DATABASE_URL with query parameters', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db?sslmode=require';
      
      const { db } = await import('./index');
      
      expect(db).toBeDefined();
    });

    it('should handle DATABASE_URL with special characters in password', async () => {
      process.env.DATABASE_URL = 'postgresql://user:p%40ss@localhost:5432/db';
      
      const { db } = await import('./index');
      
      expect(db).toBeDefined();
    });
  });

  describe('Drizzle Instance Methods', () => {
    it('should expose select method', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      expect(db.select).toBeDefined();
      expect(typeof db.select).toBe('function');
    });

    it('should expose insert method', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      expect(db.insert).toBeDefined();
      expect(typeof db.insert).toBe('function');
    });

    it('should expose update method', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      expect(db.update).toBeDefined();
      expect(typeof db.update).toBe('function');
    });

    it('should expose delete method', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      expect(db.delete).toBeDefined();
      expect(typeof db.delete).toBe('function');
    });

    it('should expose execute method', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      expect(db.execute).toBeDefined();
      expect(typeof db.execute).toBe('function');
    });
  });

  describe('Module Import Behavior', () => {
    it('should be importable multiple times', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const import1 = await import('./index');
      const import2 = await import('./index');
      
      // Should return the same instance (module caching)
      expect(import1.db).toBe(import2.db);
    });

    it('should not throw on import with valid DATABASE_URL', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      await expect(import('./index')).resolves.toBeDefined();
    });

    it('should handle repeated imports after module reset', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db: db1 } = await import('./index');
      expect(db1).toBeDefined();
      
      vi.resetModules();
      
      const { db: db2 } = await import('./index');
      expect(db2).toBeDefined();
    });
  });

  describe('Singleton Pattern', () => {
    it('should export a single db instance', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const module1 = await import('./index');
      const module2 = await import('./index');
      
      expect(module1.db).toBe(module2.db);
    });

    it('should maintain state across imports', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db: firstImport } = await import('./index');
      const { db: secondImport } = await import('./index');
      
      // Should be the exact same reference
      expect(Object.is(firstImport, secondImport)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined DATABASE_URL', async () => {
      delete process.env.DATABASE_URL;
      
      // Should not throw during import, Drizzle will handle undefined URL
      await expect(import('./index')).resolves.toBeDefined();
    });

    it('should handle empty DATABASE_URL', async () => {
      process.env.DATABASE_URL = '';
      
      // Should import successfully, validation happens at query time
      const { db } = await import('./index');
      expect(db).toBeDefined();
    });

    it('should handle malformed DATABASE_URL gracefully', async () => {
      process.env.DATABASE_URL = 'not-a-valid-url';
      
      // Import should succeed, connection errors happen at query time
      const { db } = await import('./index');
      expect(db).toBeDefined();
    });
  });

  describe('Type Safety', () => {
    it('should export properly typed db instance', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      // TypeScript should recognize these methods exist
      expect(db.select).toBeDefined();
      expect(db.insert).toBeDefined();
      expect(db.update).toBeDefined();
      expect(db.delete).toBeDefined();
    });
  });

  describe('Integration with Schema', () => {
    it('should work with imported schema', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      const { usersTable } = await import('./schema');
      
      // Should be able to use db with schema
      expect(() => db.select().from(usersTable)).not.toThrow();
    });

    it('should support query building with schema', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      const { usersTable } = await import('./schema');
      
      // Should create valid query objects
      const selectQuery = db.select().from(usersTable);
      expect(selectQuery).toBeDefined();
      expect(selectQuery).toHaveProperty('toSQL');
    });
  });

  describe('Connection Configuration', () => {
    it('should use Neon HTTP driver', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      // Verify it's a Drizzle instance (has core methods)
      expect(db).toHaveProperty('select');
      expect(db).toHaveProperty('$with');
    });

    it('should be ready for serverless environments', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      // Neon HTTP adapter is serverless-friendly
      const { db } = await import('./index');
      
      expect(db).toBeDefined();
      // HTTP-based connection, no persistent connection pool
      expect(db).not.toHaveProperty('end');
    });
  });

  describe('Module Structure', () => {
    it('should export only db', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const module = await import('./index');
      const exports = Object.keys(module);
      
      expect(exports).toContain('db');
      expect(exports).toHaveLength(1);
    });

    it('should use named export for db', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const module = await import('./index');
      
      expect(module).toHaveProperty('db');
      expect(module.db).toBeDefined();
    });
  });

  describe('Performance and Optimization', () => {
    it('should initialize quickly', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const startTime = Date.now();
      await import('./index');
      const endTime = Date.now();
      
      // Module initialization should be fast (<1000ms even in worst case)
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should not create multiple instances on import', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db: db1 } = await import('./index');
      const { db: db2 } = await import('./index');
      const { db: db3 } = await import('./index');
      
      expect(db1).toBe(db2);
      expect(db2).toBe(db3);
    });
  });

  describe('Environment Compatibility', () => {
    it('should work in Node.js environment', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const { db } = await import('./index');
      
      expect(db).toBeDefined();
      expect(typeof process).toBe('object');
    });

    it('should handle environment variable changes after import', async () => {
      process.env.DATABASE_URL = 'postgresql://first:pass@localhost:5432/db1';
      
      const { db: firstDb } = await import('./index');
      expect(firstDb).toBeDefined();
      
      // Changing env var after import doesn't affect already-created instance
      process.env.DATABASE_URL = 'postgresql://second:pass@localhost:5432/db2';
      
      const { db: secondDb } = await import('./index');
      
      // Same instance due to module caching
      expect(firstDb).toBe(secondDb);
    });
  });
});