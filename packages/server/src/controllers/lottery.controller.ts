import { Request, Response } from 'express'
import Lottery, { ILottery } from '../models/lottery.model';
import { errorResponse, successResponse } from '../utils/responseUtil'

const isValidDate = (date: Date): boolean => {
    return !isNaN(date.getTime());
};

const findLotteriesByDateRange = async (startDate: Date, endDate: Date) => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
        throw new Error('Invalid date provided');
    }
    
    if (startDate > endDate) {
        throw new Error('Start date cannot be after end date');
    }
    
    const results: ILottery[] = await Lottery.find({
        date: { $gte: startDate, $lte: endDate },
    });
    return results;
};

export const getLotteryList = async (req: Request, res: Response) => {
    const { startDate, endDate } = req.query;

    // 验证查询参数是否存在
    if (!startDate || !endDate) {
        return errorResponse(res, 400, 'startDate and endDate are required query parameters');
    }

    // 转换为Date对象
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    // 验证日期有效性
    if (!isValidDate(start) || !isValidDate(end)) {
        return errorResponse(res, 400, 'Invalid date format. Use ISO 8601 format (YYYY-MM-DD).');
    }

    try {
        const lotteries = await findLotteriesByDateRange(start, end);
        successResponse(res, 200, lotteries);
    } catch (error: any) {
        if (error.message === 'Start date cannot be after end date') {
            return errorResponse(res, 400, error.message);
        }
        errorResponse(res, 500, 'Failed to retrieve lottery data');
    }
};

// 获取所有彩票数据
export const getLotteries = async (req: Request, res: Response) => {
    try {
        const lotteries: ILottery[] = await Lottery.find();
        successResponse(res, 200, lotteries);
    } catch (error) {
        errorResponse(res, 500, 'Failed to fetch lotteries');
    }
};