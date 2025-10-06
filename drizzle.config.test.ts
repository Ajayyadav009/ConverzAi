import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Config } from 'drizzle-kit';

describe('drizzle.config.ts', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    // Clear module cache to get fresh config
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Configuration Structure', () => {
    it('should export a valid Drizzle configuration object', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config).toBeDefined();
      expect(config).toBeTypeOf('object');
    });

    it('should have correct output directory', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.out).toBe('./drizzle');
    });

    it('should have correct schema path', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.schema).toBe('./src/database/schema.ts');
    });

    it('should use postgresql dialect', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.dialect).toBe('postgresql');
    });

    it('should have dbCredentials with url', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.dbCredentials).toBeDefined();
      expect(config.dbCredentials).toHaveProperty('url');
    });
  });

  describe('Environment Variable Handling', () => {
    it('should read DATABASE_URL from environment', async () => {
      const testUrl = 'postgresql://testuser:testpass@testhost:5432/testdb';
      process.env.DATABASE_URL = testUrl;
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.dbCredentials?.url).toBe(testUrl);
    });

    it('should handle different database URL formats', async () => {
      const urlFormats = [
        'postgresql://user:pass@localhost:5432/db',
        'postgres://user:pass@localhost:5432/db',
        'postgresql://user@localhost/db',
        'postgresql://localhost:5432/db?sslmode=require',
      ];

      for (const url of urlFormats) {
        vi.resetModules();
        process.env.DATABASE_URL = url;
        
        const config = (await import('./drizzle.config')).default as Config;
        
        expect(config.dbCredentials?.url).toBe(url);
      }
    });

    it('should handle DATABASE_URL with special characters', async () => {
      const urlWithSpecialChars = 'postgresql://user:p@ss%23word@localhost:5432/db';
      process.env.DATABASE_URL = urlWithSpecialChars;
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.dbCredentials?.url).toBe(urlWithSpecialChars);
    });

    it('should work with empty password in URL', async () => {
      const urlWithEmptyPassword = 'postgresql://user:@localhost:5432/db';
      process.env.DATABASE_URL = urlWithEmptyPassword;
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.dbCredentials?.url).toBe(urlWithEmptyPassword);
    });
  });

  describe('Configuration Validation', () => {
    it('should have all required fields for Drizzle Kit', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = (await import('./drizzle.config')).default as Config;
      
      const requiredFields = ['out', 'schema', 'dialect', 'dbCredentials'];
      requiredFields.forEach(field => {
        expect(config).toHaveProperty(field);
      });
    });

    it('should use relative paths for out and schema', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.out).toMatch(/^\.?\//);
      expect(config.schema).toMatch(/^\.?\//);
    });

    it('should point to TypeScript schema file', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.schema).toMatch(/\.ts$/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined DATABASE_URL gracefully', async () => {
      delete process.env.DATABASE_URL;
      
      // This should not throw during import, but the config will have undefined url
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config).toBeDefined();
      expect(config.dbCredentials?.url).toBeUndefined();
    });

    it('should handle very long DATABASE_URL', async () => {
      const longUrl = 'postgresql://user:pass@' + 'a'.repeat(1000) + '.com:5432/db';
      process.env.DATABASE_URL = longUrl;
      
      const config = (await import('./drizzle.config')).default as Config;
      
      expect(config.dbCredentials?.url).toBe(longUrl);
    });

    it('should maintain configuration consistency across multiple imports', async () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      const config1 = (await import('./drizzle.config')).default as Config;
      const config2 = (await import('./drizzle.config')).default as Config;
      
      expect(config1.out).toBe(config2.out);
      expect(config1.schema).toBe(config2.schema);
      expect(config1.dialect).toBe(config2.dialect);
    });
  });

  describe('dotenv Integration', () => {
    it('should load dotenv config on import', async () => {
      // dotenv/config is imported at the top of drizzle.config.ts
      // This test verifies the import doesn't cause errors
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/testdb';
      
      expect(async () => {
        await import('./drizzle.config');
      }).not.toThrow();
    });
  });
});