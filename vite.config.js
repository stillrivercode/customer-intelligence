import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    // Bundle analyzer - only in analyze mode
    mode === 'analyze' && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  
  // Path resolution
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
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
    // Proxy for API calls if needed
    proxy: {
      '/api': {
        target: 'https://api.api-ninjas.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add API key to proxied requests
            if (process.env.VITE_API_NINJAS_KEY) {
              proxyReq.setHeader('X-Api-Key', process.env.VITE_API_NINJAS_KEY);
            }
          });
        }
      }
    }
  },
  
  // Build configuration
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    
    // Optimize bundle
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios', 'dayjs', 'lodash-es']
        }
      }
    },
    
    // Terser options for better minification
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    // Performance warnings
    chunkSizeWarningLimit: 1000
  },
  
  // Environment variables
  envPrefix: 'VITE_',
  
  // CSS configuration
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
        '**/*.config.ts'
      ]
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'dayjs'
    ]
  }
}));