import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/user.model';



console.log('process.env.MONGODB_URI',process.env.MONGODB_URI)

// 连接数据库
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  await deletePlaintextUsers();
  db.close();
});



async function deletePlaintextUsers() {
  try {
    const allUsers = await User.find().select('username password');
    
    console.log(`Found ${allUsers.length} users in total:`);
    // 先查找而不删除，输出匹配的用户
    const plaintextUsers = await User.find({
      password: { $regex: /^(?![$a-f0-9]{60}$).*/ }
    }).select('username password');

    console.log(`Found ${plaintextUsers.length} potential plaintext users:`);
    plaintextUsers.forEach(user => {
      console.log(`- ${user.username}: ${user.password.substring(0, 20)}...`);
    });

    // 确认是否真的要删除
    if (plaintextUsers.length > 0) {
      const result = await User.deleteMany({
        password: { $regex: /^(?![$a-f0-9]{60}$).*/ }
      });
      console.log(`Deleted ${result.deletedCount} users`);
    } else {
      console.log('No users with plaintext passwords found');
    }
  } catch (error) {
    console.error('Error deleting users:', error);
  }
}    