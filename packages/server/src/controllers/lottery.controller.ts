import { Request, Response } from 'express'
import Lottery, { ILottery } from '../models/lottery.model';
import { errorResponse, successResponse } from '../utils/responseUtil'


const getFrequency = async (startDate: Date, endDate: Date) => {
    const results: ILottery[] = await Lottery.find({
        date: { $gte: startDate, $lte: endDate },
    });

    const redBallFrequency: { [key: number]: number } = {};
    const blueBallFrequency: { [key: number]: number } = {};

    for (const result of results) {
        if (result.redBalls && result.blueBall) {
            for (const redBall of result.redBalls) {
                redBallFrequency[redBall] = (redBallFrequency[redBall] || 0) + 1;
            }
            blueBallFrequency[result.blueBall] = (blueBallFrequency[result.blueBall] || 0) + 1;
        }
    }
    return { redBallFrequency, blueBallFrequency };
};

export const getLotteryFrequency = async (req: Request, res: Response) => {
    const { timeRange } = req.query;
    let startDate: Date;
    const endDate = new Date();

    switch (timeRange) {
        case 'threeYears':
            startDate = new Date(endDate.getFullYear() - 3, endDate.getMonth(), endDate.getDate());
            break;
        case 'oneYear':
            startDate = new Date(endDate.getFullYear() - 1, endDate.getMonth(), endDate.getDate());
            break;
        case 'halfYear':
            startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 6, endDate.getDate());
            break;
        case 'threeMonths':
            startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 3, endDate.getDate());
            break;
        case 'oneMonth':
            startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate());
            break;
        default:
            return errorResponse(res, 400, 'Invalid time range');


    }

    try {
        const { redBallFrequency, blueBallFrequency } = await getFrequency(startDate, endDate)
        res.status(200).json({ redBallFrequency, blueBallFrequency })
        successResponse(res, 200, { redBallFrequency, blueBallFrequency });

    } catch (error) {
        errorResponse(res, 500, 'Failed to get lottery frequency');

    }
}

// 获取所有彩票数据
export const getLotteries = async (req: Request, res: Response) => {
    try {
        const lotteries: ILottery[] = await Lottery.find();
        successResponse(res, 200, lotteries);

    } catch (error) {
        errorResponse(res, 500, 'Failed to fetch lotteries');

    }
}
