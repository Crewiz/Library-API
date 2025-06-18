import { Request, Response, NextFunction } from 'express';
import { ApiError, ErrorCode } from './apiError';

export function validateParams(...paramNames: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    for (const name of paramNames) {
      const val = req.params[name];
      if (!val || typeof val !== 'string') {
        return next(
          ApiError.badRequest(
            ErrorCode.INVALID_INPUT,
            `\`${name}\` parameter is required`
          )
        );
      }
    }
    next();
  };
}

export function validateRentBookBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } = req.body;
  if (!userId || typeof userId !== 'string') {
    return next(
      ApiError.badRequest(
        ErrorCode.INVALID_INPUT,
        '`userId` is required in request body'
      )
    );
  }
  next();
}
