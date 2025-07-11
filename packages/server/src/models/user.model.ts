import mongoose, { Document, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    permissions?: string[]; // Add this line to define permissions
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // 添加 email 字段
    role: { type: String, required: true, enum: ['admin', 'user'] },
    permissions: [{ type: String }], // 权限数组


}, { timestamps: true });

// 密码加密
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 密码验证
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model<IUser>('User', userSchema, 'users');

export default User;