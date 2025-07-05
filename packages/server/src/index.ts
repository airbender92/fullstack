import express from "express";
import cors from 'cors'
import {config} from 'dotenv'
import connectDB from "./config/db";
import userRoutes from './routes/user.routes'

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

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})