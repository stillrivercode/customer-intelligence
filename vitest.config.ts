import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/services': resolve(__dirname, './src/services'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/data': resolve(__dirname, './src/data'),
      '@/types': resolve(__dirname, './src/types')
    }
  },
  
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        '**/*.config.{js,ts}',
        '**/types.ts',
        'src/main.tsx',
        'src/vite-env.d.ts'
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
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}'
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