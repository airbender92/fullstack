import { makeObservable, observable, action, runInAction } from 'mobx';
import { getLotteryByRange, Lottery, ITimeRange, queryExistApi, Ball } from '@/service/lottery';

class LotteryStore {
  @observable lotteries: Lottery[] = [];
  @observable loading: boolean = false;
  @observable error: string | null = null;

  constructor() {
    makeObservable(this);
  }


  /**
   * 根据日期范围获取彩票数据
   */
  @action
  fetchLotteriesByRange = async (range: ITimeRange) => {
    this.loading = true;
    this.error = null;
    try {
      const data = await getLotteryByRange(range);
      runInAction(() => {
        this.lotteries = data;
        this.loading = false;
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = err?.message || '获取彩票数据失败';
        this.loading = false;
      });
    }
  };

    /**
   * 查找是否已存在
   */
  @action
  queryExist = async (params: Ball) => {
    try {
      const result:any = await queryExistApi(params);
      return result.exists ? 1 : 0;
    } catch (err: any) {
      return -1;
    }
  };
}

export default LotteryStore;
