import express from "express";
import cors from 'cors'
import {config} from 'dotenv'
import connectDB from "./config/db";
import userRoutes from './routes/user.routes'
import lotteryRoutes from './routes/lottery.routes';
import authRoutes from './routes/auth.routes'
import syncData from "./config/syncData";
import cron from 'node-cron'

config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 连接数据库
connectDB();

// 路由
app.use('/api/users', userRoutes);
app.use('/api/lottery', lotteryRoutes);
app.use('/api/auth', authRoutes);

// 每周同步一次数据
cron.schedule('0 0 * * 0', () => {
    syncData();
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})