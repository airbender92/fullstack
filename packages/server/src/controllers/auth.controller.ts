import { Request, Response } from 'express'
import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import { errorResponse, successResponse } from '../utils/responseUtil'

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
}

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
}

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        if (!user || !(await user.comparePassword(password))) {
            return errorResponse(res, 401, 'Invalid credentials');
        }
        const token = generateToken(user._id as string);
        const refreshToken = generateRefreshToken(user._id as string);

        successResponse(res, 200, { token, refreshToken, userId: user._id });

    } catch (error) {
        return errorResponse(res, 500, 'Internal server error');
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return errorResponse(res, 401, 'Refresh token is required');
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
        const userId = (decoded as { userId: string }).userId;

        const newToken = generateToken(userId);
        const newRefreshToken = generateRefreshToken(userId);
        successResponse(res, 200, { token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
        return errorResponse(res, 401, 'Invalid refresh token');

    }
}

export const getPermissions = async (req: Request, res: Response) => {
    // 认证中间件设置
    const userId = req.user;
    // 获取用户权限
    const user = await User.findById(userId).select('permissions');
    if (!user) {
        return errorResponse(res, 404, 'User not found');

    }
    successResponse(res, 200, user.permissions || []);
}