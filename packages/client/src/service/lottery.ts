import request from '@/utils/request';

export type Ball = {
  redBalls: number[];
  blueBall: number;
}

export interface Lottery extends Ball {
  _id: string;
  date: string;
  [key: string]: any;
}

export interface ITimeRange {
  startDate: string;
  endDate: string;
}


/**
 * 根据range获取lottery
 * @returns 
 */
export const getLotteryByRange = (timeRange: ITimeRange) => request.get<Lottery[]>('/api/lottery/getLotteryByRange', { params: timeRange });
export const queryExistApi = (params: Ball) => request.post<Boolean>('/api/lottery/checkLotteryExists', params);
