import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  prettier,
  {
    files: ['**/*.js'],
    languageOptions: { globals: { process: 'readonly', console: 'readonly', crypto: 'readonly' } },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
    },
  },
];
