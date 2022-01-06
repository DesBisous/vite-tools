import path from 'path';
import serve from 'rollup-plugin-serve';
import babel from 'rollup-plugin-babel'; // 让我们可以使用es6新特性来编写代码
import commonjs from 'rollup-plugin-commonjs'; // 将CommonJS模块转换为 ES2015 供 Rollup 处理
import resolve from 'rollup-plugin-node-resolve'; // 帮助 Rollup 查找外部模块，然后导入
import rollupTypescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser'; // 压缩js代码，包括es6代码压缩
import { eslint } from 'rollup-plugin-eslint';
import { DEFAULT_EXTENSIONS } from '@babel/core';

import pkg from './package.json';
export const isDev = process.env.NODE_ENV !== 'production';

export const globals = {
  'decimal.js': 'decimal.js',
  jsencrypt: 'jsencrypt',
};

const defaultRollupConfig = {
  external: Object.keys(globals), // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
  // plugins 需要注意引用顺序
  plugins: [
    // 验证导入的文件
    eslint({
      throwOnError: true, // lint 结果有错误将会抛出异常
      throwOnWarning: true,
      include: ['src/**/*.ts', 'src/**/*.js'],
      exclude: ['node_modules/**', 'lib/**'],
    }),
    // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
    commonjs(),
    // 配合 commnjs 解析第三方模块
    resolve({
      // 将自定义选项传递给解析插件
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
    }),
    rollupTypescript({
      tsconfig: path.join(__dirname, './tsconfig.json'), // 本地ts配置
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    }),
    babel({
      runtimeHelpers: true,
      // 只转换源代码，不运行外部依赖
      exclude: 'node_modules/**',
      // babel 默认不支持 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    }),
    !isDev && terser(),
    isDev &&
      serve({
        open: false,
        port: 8080,
        contentBase: '',
        openPage: '/public/index.html',
      }),
  ],
};

// rollup 配置项
const rollupConfig = {
  input: path.join(__dirname, 'src/index.ts'),
  output: [
    // 输出 commonjs 规范的代码
    { format: 'cjs', name: pkg.name, file: pkg.main, sourcemap: isDev, exports: 'named' },
    // 输出 es 规范的代码
    { format: 'es', name: pkg.name, file: pkg.module, sourcemap: isDev, exports: 'named' },
    // 输出 umd 规范的代码
    { format: 'umd', name: pkg.name, file: pkg.browser, sourcemap: isDev, exports: 'named' },
  ],
  ...defaultRollupConfig,
};

const hookRollupConfig = {
  input: path.join(__dirname, 'src/hook/index.ts'),
  output: [
    // 输出 umd 规范的代码
    { format: 'umd', name: pkg.name, file: 'lib/ajaxHook.js', sourcemap: isDev, exports: 'named' },
  ],
  external: Object.keys(globals), // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
  plugins: [
    rollupTypescript({
      tsconfig: path.join(__dirname, './tsconfig.json'), // 本地ts配置
      extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    }),
  ],
};

// export default [rollupConfig, hookRollupConfig];
export default [hookRollupConfig];
