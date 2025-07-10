import { makeObservable, observable, action, runInAction } from 'mobx';
import { getLotteryByRange, Lottery, ITimeRange } from '@/service/lottery';

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
}

export default LotteryStore;
