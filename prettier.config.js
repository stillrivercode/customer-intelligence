export default {
  // Core formatting
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  
  // JSX formatting
  jsxSingleQuote: true,
  
  // Trailing commas
  trailingComma: 'es5',
  
  // Bracket formatting
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow functions
  arrowParens: 'avoid',
  
  // Range formatting
  rangeStart: 0,
  rangeEnd: Infinity,
  
  // Parser
  requirePragma: false,
  insertPragma: false,
  proseWrap: 'preserve',
  
  // HTML
  htmlWhitespaceSensitivity: 'css',
  
  // Vue (if needed)
  vueIndentScriptAndStyle: false,
  
  // End of line
  endOfLine: 'lf',
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // Override for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
        tabWidth: 2
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always'
      }
    },
    {
      files: '*.{yaml,yml}',
      options: {
        tabWidth: 2,
        singleQuote: false
      }
    }
  ]
};