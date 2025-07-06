// client/src/store/Page1.store.ts
import { makeObservable, observable, action } from 'mobx';

class Page1Store {
  @observable data: any[] = [];

  constructor() {
    makeObservable(this);
  }

  @action
  fetchData = () => {
    // 模拟数据获取
    this.data = [1, 2, 3];
  };
}

export default Page1Store;
