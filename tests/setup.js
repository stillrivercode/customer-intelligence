/**
 * Test Setup for Root-Level Tests
 * 
 * This file configures the test environment for root-level tests,
 * particularly for testing IDK integration and other project-level features.
 */

import { beforeAll, afterAll } from 'vitest';
import { join } from 'path';
import { chdir, cwd } from 'process';

// Store original working directory
const originalCwd = cwd();

beforeAll(() => {
  // Ensure we're in the project root for all tests
  const projectRoot = join(originalCwd);
  chdir(projectRoot);
});

afterAll(() => {
  // Restore original working directory
  chdir(originalCwd);
});

// Global test utilities
globalThis.testUtils = {
  projectRoot: originalCwd,
  docsPath: join(originalCwd, 'docs'),
  scriptsPath: join(originalCwd, 'scripts'),
  appPath: join(originalCwd, 'app')
};