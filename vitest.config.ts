import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './app/src'),
      '@/components': resolve(__dirname, './app/src/components'),
      '@/utils': resolve(__dirname, './app/src/utils'),
      '@/services': resolve(__dirname, './app/src/services'),
      '@/hooks': resolve(__dirname, './app/src/hooks'),
      '@/data': resolve(__dirname, './app/src/data'),
      '@/types': resolve(__dirname, './app/src/types')
    }
  },
  
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./app/src/test/setup.ts', './tests/setup.js'],
    css: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'app/src/test/',
        'app/src/**/*.test.{ts,tsx}',
        'app/src/**/*.spec.{ts,tsx}',
        '**/*.config.{js,ts}',
        '**/types.ts',
        'app/src/main.tsx',
        'app/src/vite-env.d.ts'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    
    // Test file patterns
    include: [
      'app/src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    
    // Watch options
    watch: {
      clearScreen: false
    },
    
    // Performance settings
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporter options
    reporters: ['verbose'],
    
    // Mock options
    clearMocks: true,
    restoreMocks: true,
    
    // Environment variables for tests
    env: {
      NODE_ENV: 'test',
      VITE_API_NINJAS_KEY: 'test-api-key'
    }
  }
});