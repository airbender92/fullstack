// utils/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { errorResponse } from './responseUtil'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  if (err instanceof TokenExpiredError) {
    return errorResponse(res, 401, 'Token expired');
  }
  
  if (err instanceof JsonWebTokenError) {
    return errorResponse(res, 401, 'Invalid token');
  }
  
  return errorResponse(res, 500, 'Internal server error');
};