// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { errorResponse } from '../utils/responseUtil'

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: string;
    }
  }
}


export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return errorResponse(res, 401, 'Unauthorized');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = decoded.userId; // 将用户 ID 添加到请求对象中
    next();
  } catch (error) {
    next(error); // 将错误传递给错误处理中间件
  }
};