module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: ['server'],
  plugins: [
    'react-refresh',
    '@typescript-eslint',
    'prettier'
  ],
  rules: {
    'react-refresh/only-export-components': 'warn',

    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'no-return-assign': 'off',
    'spaced-comment': 'warn',
    'react/button-has-type': 'off',
    'import/no-absolute-path': 'off',
    'prefer-const': 'warn',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    'no-promise-executor-return': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    "@typescript-eslint/no-explicit-any": "off",
  },
}
