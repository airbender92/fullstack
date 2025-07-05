import axios from "axios";
import mongoose from "mongoose";
import { config } from 'dotenv'
import { ILottery} from '../models/lottery.model'
import Lottery from "../models/lottery.model";

config();

const uri = process.env.MONGODB_URI as string;
mongoose.connect(uri);


// 双色球 API 接口
const API_URL = '';

const fetchExternalLotteryData = async() => {
    return [] as ILottery[];
}

const syncData = async() => {
    try{
        const lotteries: ILottery[] = await fetchExternalLotteryData();

        for(const lottery of lotteries) {
            await Lottery.findOneAndUpdate(
                {date: lottery.date},
                lottery,
                {upsert: true}
            );
        }

        console.log('Data synced successfully')
    } catch(error) {
        console.error('Error syncing data: ', error)
    }
}

export default syncData;