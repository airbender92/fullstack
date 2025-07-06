import parser from '@typescript-eslint/parser';
import plugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
         globals: {
        ...globals.node,  // 例如使用 Node.js 全局变量
      },
      parser: parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: { '@typescript-eslint': plugin },
    rules: {
      // 自定义规则
    },
  },
];