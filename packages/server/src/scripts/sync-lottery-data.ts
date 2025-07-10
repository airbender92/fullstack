import mongoose from 'mongoose';
import 'dotenv/config';
import Lottery, { ILottery } from '../models/lottery.model';
import { errorResponse } from '../utils/responseUtil';
import {data} from '../originData/lotty/2025';

// 模拟从外部获取需要同步的彩票数据
type LotteryInput = {
    date: Date;
    redBalls: number[];
    blueBall: number;
};

const getExternalLotteryData = (): LotteryInput[] => {
    return data;
};

// 模拟获取需要删除的彩票记录的日期标识
const getLotteryDatesToDelete = (): Date[] => {
    return [new Date('1990-01-03')];
};

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
    try {
        await syncLotteryData();
        console.log('Lottery data synced successfully');
    } catch (error) {
        errorResponse({ status: (code: number) => ({ json: (data: any) => console.error(data) }) } as any, 500, 'Error syncing lottery data', error);
    }
    db.close();
});

async function syncLotteryData() {
    // 获取外部数据源
    const externalLotteries = getExternalLotteryData();

    // 获取需要删除的记录的日期标识
    const datesToDelete = getLotteryDatesToDelete();

    // 删除指定日期的记录
    for (const date of datesToDelete) {
        const result = await Lottery.deleteMany({ date });
        if (result.deletedCount > 0) {
            console.log(`Deleted ${result.deletedCount} lottery records with date: ${date}`);
        } else {
            console.log(`No lottery records found with date: ${date}`);
        }
    }

    // 新增或编辑记录
    for (const externalLottery of externalLotteries) {
        const existingLottery = await Lottery.findOne({ date: externalLottery.date });
        if (existingLottery) {
            // 编辑现有记录
            existingLottery.redBalls = externalLottery.redBalls;
            existingLottery.blueBall = externalLottery.blueBall;
            await existingLottery.save();
            console.log(`Updated lottery record with date: ${externalLottery.date}`);
        } else {
            // 新增记录
            const newLottery = new Lottery(externalLottery);
            await newLottery.save();
            console.log(`Added new lottery record with date: ${externalLottery.date}`);
        }
    }
}