/**
 * 初始化账户
 * 执行命令：ts-node init-db.ts
 */

import mongoose from 'mongoose'
import 'dotenv/config';
import User from '../models/user.model';

console.log('process.env.MONGODB_URI',process.env.MONGODB_URI)


// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error：'))
db.once('open', async() => {
    console.log('connected to db')
    await seedUsers();
    db.close();
});

async function seedUsers(){
    try{
        const count = await User.countDocuments();
        if(count > 0) {
            console.log('Database already seeded with users');
            return;
        };
          // 定义权限映射
        const rolePermissions = {
            admin: ['home', 'profile', 'lottery', 'admin-dashboard'],
            user: ['home', 'profile', 'lottery']
        };
        // 初始账号
        const initialUsers = [
            {
                username: 'admin',
                password: 'admin123',
                email: 'admin@example.com',
                role: 'admin',
                 permissions: rolePermissions.admin // 管理员权限
            },
             {
                username: 'user',
                password: 'user123',
                email: 'user@example.com',
                role: 'user',
                 permissions: rolePermissions.user // 普通用户权限
            }
        ];
        // 这里使用save()逐个保存，触发pre-save钩子
        for(const userData of initialUsers){
            const user = new User(userData);
            await user.save();
            console.log(`Seeded user: ${user.username}`)
        }
        console.log('Successfully seeded users')
    }catch(error) {
        console.error('Error seeding users: ', error)
    }
}
