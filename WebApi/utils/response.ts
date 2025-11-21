import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  result?: T;
  statusCode?: number;
}

export function sendApiResponse<T>(
    res: Response, {
    success = true,
    message = '',
    result,
    statusCode = 200
}: ApiResponse<T>) {
  return res.status(statusCode).json({
    success,
    message,
    result
  });
}
