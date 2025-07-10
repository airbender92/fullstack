import request from '@/utils/request';


export interface Lottery {
  _id: string;
  date: string;
  redBalls: number[];
  blueBall: number;
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
