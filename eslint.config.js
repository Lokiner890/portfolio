import { defineConfig, globalIgnores } from 'eslint/config';
import coaxNext from '@coaxsoft/eslint-config-fe-react/next';
import vitest from '@vitest/eslint-plugin';

export default defineConfig([
  // generated files (node_modules is ignored by default)
  globalIgnores([
    '.next',
    'out',
    'next-env.d.ts',
    'coverage',
    '.vitest',
    '.scannerwork',
  ]),
  ...coaxNext,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    rules: {
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      'no-useless-escape': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // the base rule reports parameter names in function types, the typescript-eslint version replaces it
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      // deeply nested describe blocks make tests hard to read
      'vitest/max-nested-describe': ['error', { max: 3 }],
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
]);
