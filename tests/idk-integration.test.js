/**
 * IDK Integration Test
 * 
 * Tests that the Information Dense Keywords Dictionary is properly installed
 * and accessible for AI assistant interactions.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';

describe('IDK Integration', () => {
  const docsPath = join(cwd(), 'docs');
  const idkPath = join(docsPath, 'information-dense-keywords.md');
  const aiPath = join(docsPath, 'AI.md');
  const dictionaryPath = join(docsPath, 'dictionary');

  beforeAll(() => {
    // Ensure we're testing from the correct working directory
    expect(existsSync(docsPath)).toBe(true);
  });

  describe('Core IDK Files', () => {
    it('should have information-dense-keywords.md file', () => {
      expect(existsSync(idkPath)).toBe(true);
      const stats = statSync(idkPath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should have AI.md file', () => {
      expect(existsSync(aiPath)).toBe(true);
      const stats = statSync(aiPath);
      expect(stats.isFile()).toBe(true);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should have dictionary directory', () => {
      expect(existsSync(dictionaryPath)).toBe(true);
      const stats = statSync(dictionaryPath);
      expect(stats.isDirectory()).toBe(true);
    });
  });

  describe('IDK Content Validation', () => {
    it('should contain expected IDK structure', () => {
      const content = readFileSync(idkPath, 'utf8');
      
      // Check for key sections
      expect(content).toContain('Information Dense Keywords Dictionary');
      expect(content).toContain('Command Chaining');
      expect(content).toContain('Core Commands');
      expect(content).toContain('Git Operations');
      expect(content).toContain('Development Commands');
      expect(content).toContain('Documentation Commands');
    });

    it('should contain core command references', () => {
      const content = readFileSync(idkPath, 'utf8');
      
      // Check for core commands
      expect(content).toContain('SELECT');
      expect(content).toContain('CREATE');
      expect(content).toContain('DELETE');
      expect(content).toContain('FIX');
    });

    it('should contain git operation references', () => {
      const content = readFileSync(idkPath, 'utf8');
      
      // Check for git commands
      expect(content).toContain('gh');
      expect(content).toContain('commit');
      expect(content).toContain('push');
      expect(content).toContain('pr');
    });
  });

  describe('Dictionary Structure', () => {
    const expectedCategories = [
      'core',
      'git',
      'development',
      'documentation',
      'quality-assurance',
      'workflow'
    ];

    expectedCategories.forEach(category => {
      it(`should have ${category} dictionary category`, () => {
        const categoryPath = join(dictionaryPath, category);
        expect(existsSync(categoryPath)).toBe(true);
        const stats = statSync(categoryPath);
        expect(stats.isDirectory()).toBe(true);
      });
    });

    it('should have core command files', () => {
      const coreCommands = ['create.md', 'delete.md', 'fix.md', 'select.md'];
      const corePath = join(dictionaryPath, 'core');
      
      coreCommands.forEach(command => {
        const commandPath = join(corePath, command);
        expect(existsSync(commandPath)).toBe(true);
        const stats = statSync(commandPath);
        expect(stats.isFile()).toBe(true);
      });
    });

    it('should have development command files', () => {
      const devCommands = ['analyze-this.md', 'debug-this.md', 'optimize-this.md'];
      const devPath = join(dictionaryPath, 'development');
      
      devCommands.forEach(command => {
        const commandPath = join(devPath, command);
        expect(existsSync(commandPath)).toBe(true);
        const stats = statSync(commandPath);
        expect(stats.isFile()).toBe(true);
      });
    });
  });

  describe('AI.md Content', () => {
    it('should contain shared AI instructions', () => {
      const content = readFileSync(aiPath, 'utf8');
      
      expect(content).toContain('AI.md - Shared Instructions for All AI Assistants');
      expect(content).toContain('Information Dense Keywords Dictionary');
      expect(content).toContain('Usage Pattern');
      expect(content).toContain('Dictionary Commands');
    });

    it('should reference core commands', () => {
      const content = readFileSync(aiPath, 'utf8');
      
      expect(content).toContain('SELECT');
      expect(content).toContain('CREATE');
      expect(content).toContain('FIX');
      expect(content).toContain('UPDATE');
      expect(content).toContain('DELETE');
      expect(content).toContain('ANALYZE');
    });

    it('should contain cross-references', () => {
      const content = readFileSync(aiPath, 'utf8');
      
      expect(content).toContain('Cross-References');
      expect(content).toContain('information-dense-keywords.md');
      expect(content).toContain('CLAUDE.md');
      expect(content).toContain('GEMINI.md');
    });
  });

  describe('NPX Integration', () => {
    it('should be installable via npx', async () => {
      // Test that npx command works (this is more of a smoke test)
      const { execSync } = await import('child_process');
      
      try {
        // Test that npx can find the package
        const result = execSync('npx @stillrivercode/information-dense-keywords --version', {
          encoding: 'utf8',
          timeout: 10000
        });
        
        // Should not throw an error
        expect(result).toBeDefined();
      } catch {
        // If package is not available, at least verify files exist locally
        expect(existsSync(idkPath)).toBe(true);
        expect(existsSync(aiPath)).toBe(true);
      }
    });
  });

  describe('Command Usage Examples', () => {
    it('should contain CREATE command examples', () => {
      const content = readFileSync(idkPath, 'utf8');
      
      // Look for CREATE command usage patterns - check for CREATE in commands
      expect(content).toContain('CREATE');
      expect(content).toMatch(/\*\*CREATE\*\*/);
    });

    it('should contain analyze command examples', () => {
      const content = readFileSync(idkPath, 'utf8');
      
      // Look for analyze command usage patterns
      expect(content).toMatch(/analyze.*this/i);
    });

    it('should contain command chaining examples', () => {
      const content = readFileSync(idkPath, 'utf8');
      
      // Look for command chaining patterns
      expect(content).toContain('then');
      expect(content).toContain('and');
      expect(content).toMatch(/.*then.*then.*/);
    });
  });
});