/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    '@vue/prettier'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2022,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  rules: {
    // Vue 相关
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-explicit-emits': ['warn', {
      allowProps: false
    }],
    'vue/component-tags-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/block-order': ['error', {
      order: ['script', 'template', 'style']
    }],
    'vue/component-name-in-template-casing': ['warn', 'PascalCase', {
      registeredComponentsOnly: true
    }],
    'vue/html-self-closing': ['warn', {
      html: { void: 'always', normal: 'never', component: 'always' }
    }],
    'vue/no-unused-vars': 'warn',

    // TypeScript 相关
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': ['error', {
      'ts-expect-error': 'allow-with-description',
      'ts-ignore': false,
      'ts-nocheck': false,
      'ts-check': false
    }],
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': ['error', {
      extendDefaults: true,
      types: {
        '{}': false,
        'object': false,
        'Function': false
      }
    }],

    // Prettier
    'prettier/prettier': 'error',

    // ESLint 基础
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off',
    'no-redeclare': 'error',

    // 最佳实践
    'prefer-const': 'warn',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],

    // 格式化
    'array-bracket-spacing': ['error', 'never'],
    'object-curly-spacing': ['error', 'always'],
    'object-curly-newline': ['error', {
      ObjectExpression: { minProperties: 4 },
      ObjectPattern: { minProperties: 4 }
    }],
    'operator-linebreak': ['error', 'after'],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline'
    }]
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly'
  }
}
