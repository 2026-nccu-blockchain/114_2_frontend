import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.env*', '*.log', 'tailwind.config.ts']),

  // TypeScript / TSX files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        tsconfigRootDir: import.meta.dirname,
        // Do NOT set `project` here to avoid missing-project errors in certain environments
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  // Test files - enable jest globals
  {
    files: ['**/__tests__/**', '**/*.test.*'],
    languageOptions: {
      globals: { ...globals.browser, describe: 'readonly', it: 'readonly', expect: 'readonly' },
    },
    rules: {
      // keep stricter rules but allow jest globals
    },
  },

  // JavaScript files
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
  },
  // Vite / config files - node environment
  {
    files: ['vite.config.*', 'tailwind.config.*', 'postcss.config.*', 'eslintrc.*'],
    languageOptions: { globals: { ...globals.node, process: 'readonly' } },
  },
])
