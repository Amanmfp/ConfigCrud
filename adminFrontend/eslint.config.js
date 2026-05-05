import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // This is a schema-driven app with dynamic records/fields.
      // We keep types where they add safety, but allow `any` at integration boundaries.
      '@typescript-eslint/no-explicit-any': 'off',

      // React Hook lint rule is too strict for dynamic field registries.
      'react-hooks/static-components': 'off',

      // Some pages legitimately hydrate local state from async fetches.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
])
