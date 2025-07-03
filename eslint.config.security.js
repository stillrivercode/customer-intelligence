import js from '@eslint/js';
import globals from 'globals';
import security from 'eslint-plugin-security';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
      '.eslintrc*.js'
    ]
  },
  
  // Security-focused configuration
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024
      }
    },
    plugins: {
      security
    },
    rules: {
      ...js.configs.recommended.rules,
      ...security.configs.recommended.rules,
      
      // Security-specific rules
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-child-process': 'error',
      'security/detect-disable-mustache-escape': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-non-literal-fs-filename': 'warn',
      'security/detect-non-literal-require': 'warn',
      'security/detect-possible-timing-attacks': 'warn',
      'security/detect-pseudoRandomBytes': 'error',
      
      // Prevent common security issues
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      
      // API key and secret detection
      'security/detect-unsafe-regex': 'error',
      
      // Additional security rules for React apps
      'no-dangerously-set-inner-html': 'off', // Custom rule for React
      
      // Strict mode
      'strict': ['error', 'never'] // ES modules are automatically strict
    }
  },
  
  // TypeScript security configuration
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // TypeScript security rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn'
    }
  },
  
  // React-specific security rules
  {
    files: ['**/*.{jsx,tsx}'],
    rules: {
      // Prevent XSS
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',
      
      // Prevent injection attacks
      'react/jsx-no-script-url': 'error',
      'react/jsx-no-target-blank': ['error', { 
        allowReferrer: false,
        enforceDynamicLinks: 'always'
      }]
    }
  }
];