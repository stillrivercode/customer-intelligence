import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './workshop/**/*.{md,html}'
  ],
  
  theme: {
    extend: {
      // Custom color palette for the dashboard
      colors: {
        // Primary brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        
        // Health score colors
        health: {
          excellent: '#10b981', // green-500
          good: '#f59e0b',       // amber-500
          warning: '#ef4444',    // red-500
          critical: '#dc2626'    // red-600
        },
        
        // Sentiment colors
        sentiment: {
          positive: '#059669',   // emerald-600
          neutral: '#6b7280',    // gray-500
          negative: '#dc2626'    // red-600
        },
        
        // Status colors
        status: {
          online: '#10b981',
          offline: '#ef4444',
          pending: '#f59e0b',
          unknown: '#6b7280'
        }
      },
      
      // Custom font family
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono]
      },
      
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      
      // Custom border radius
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      
      // Custom shadows
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        'strong': '0 8px 24px 0 rgba(0, 0, 0, 0.2)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.3)'
      },
      
      // Animation extensions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite'
      },
      
      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      
      // Typography extensions
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            a: {
              color: '#3b82f6',
              '&:hover': {
                color: '#2563eb'
              }
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '600'
            }
          }
        }
      },
      
      // Screen size extensions
      screens: {
        'xs': '475px',
        '3xl': '1920px'
      },
      
      // Grid extensions
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(250px, 1fr))'
      }
    }
  },
  
  // Plugins
  plugins: [
    // Typography plugin for markdown content
    require('@tailwindcss/typography'),
    
    // Forms plugin for better form styling
    require('@tailwindcss/forms'),
    
    // Aspect ratio plugin
    require('@tailwindcss/aspect-ratio'),
    
    // Custom components
    function({ addComponents, theme }) {
      addComponents({
        // Dashboard card component
        '.dashboard-card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.soft'),
          border: `1px solid ${theme('colors.gray.200')}`,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme('boxShadow.medium'),
            transform: 'translateY(-1px)'
          }
        },
        
        // Widget header
        '.widget-header': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme('spacing.4'),
          paddingBottom: theme('spacing.2'),
          borderBottom: `1px solid ${theme('colors.gray.200')}`
        },
        
        // Status badge
        '.status-badge': {
          display: 'inline-flex',
          alignItems: 'center',
          paddingLeft: theme('spacing.2'),
          paddingRight: theme('spacing.2'),
          paddingTop: theme('spacing.1'),
          paddingBottom: theme('spacing.1'),
          borderRadius: theme('borderRadius.full'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.tight')
        },
        
        // Loading skeleton
        '.skeleton': {
          backgroundColor: theme('colors.gray.200'),
          borderRadius: theme('borderRadius.md'),
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }
      })
    }
  ],
  
  // Dark mode configuration
  darkMode: 'class'
};