/// <reference types="react-scripts" />

// 支持导入 .less 文件
declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}

// 通用模块声明，确保 TypeScript 能正确解析所有模块
declare module '*';

// client/src/webpack-env.d.ts
declare module 'webpack' {
  function requireContext(
    directory: string,
    includeSubdirs: boolean,
    filter: RegExp
  ): {
    keys(): string[];
    <T>(id: string): T;
    resolve(id: string): string;
  };
}

declare var require: {
  context: typeof requireContext;
};

// Add type declaration for __WebpackModuleApi.RequireContext if not already present
declare namespace __WebpackModuleApi {
  interface RequireContext {
    keys(): string[];
    (id: string): any;
  }
}