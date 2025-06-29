/// <reference types="react-scripts" />

// 支持导入 .less 文件
declare module '*.less' {
  const classes: { [key: string]: string };
  export default classes;
}