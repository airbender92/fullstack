// client/src/store/RootStore.ts
import { makeObservable } from 'mobx';

class RootStore {
   // 定义索引签名，允许通过字符串访问属性
  [key: string]: any; 

  constructor() {
    makeObservable(this);
    this.importStores();
  }

  importStores() {
    // 这里需要一个类型断言来告诉 TypeScript require.context 的类型
    const storeContext = require.context('.', true, /\.store\.(ts|js)$/) as __WebpackModuleApi.RequireContext;
    storeContext.keys().forEach((key: string) => {
      const storeModule = storeContext(key);
      const storeName = Object.keys(storeModule)[0];
      const StoreClass = storeModule[storeName];
      this[storeName] = new StoreClass();
    });
  }
}

export default RootStore;


/**
 * 
 * 代码解释
require.context('.', true, /\.store\.(ts|js)$/)：这行代码创建了一个上下文，用于查找当前目录（store 目录）下所有以 .store.ts 或 .store.js 结尾的文件。
第一个参数 . 表示当前目录。
第二个参数 true 表示递归查找子目录。
第三个参数 /\.store\.(ts|js)$/ 是一个正则表达式，用于匹配文件名。
storeContext.keys()：返回匹配到的所有文件的路径数组。
storeContext(key)：动态导入匹配到的文件。
const storeName = Object.keys(storeModule)[0]：获取导入模块的默认导出的名称。
const StoreClass = storeModule[storeName]：获取默认导出的类。
this[storeName] = new StoreClass()：创建该类的实例并挂载到 RootStore 上。
 */