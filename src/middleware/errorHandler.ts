import { Request, Response, NextFunction } from 'express';
import { ApiError } from './apiError';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      status: err.status,
      code: err.code,
      message: err.message,
    });
  } else {
    console.error({
      path: req.method + ' ' + req.originalUrl,
      error: err,
    });
    res.status(500).json({
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
}