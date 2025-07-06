import {  Response} from 'express'

/**
 * 错误响应
 * @param res 
 * @param statusCode 
 * @param message 
 * @param details 
 * @returns 
 */
const errorResponse = (res: Response, statusCode: number, message: string, details?: any) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      details
    }
  });
};

/**
 * 成功响应
 * @param res 
 * @param statusCode 
 * @param data 
 * @returns 
 */
const successResponse = (res: Response, statusCode: number, data: any) => {
  return res.status(statusCode).json({
    success: true,
    data // 成功响应直接返回数据
  });
};

export {errorResponse, successResponse}