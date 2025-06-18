export enum ErrorCode {
    INVALID_INPUT = 'INVALID_INPUT',
    ROUTE_NOT_FOUND = 'ROUTE_NOT_FOUND',
    BOOK_NOT_FOUND = 'BOOK_NOT_FOUND',
    NO_COPIES_AVAILABLE = 'NO_COPIES_AVAILABLE',
    RENTAL_NOT_FOUND = 'RENTAL_NOT_FOUND',
    RENTAL_ALREADY_RETURNED = 'RENTAL_ALREADY_RETURNED'
}

export class ApiError extends Error {
    constructor(
        public status: number,
        public code: ErrorCode,
        message: string
    ) {
        super(message);
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(code: ErrorCode, msg: string)   {
        return new ApiError(400, code, msg);
      }
      static notFound(code: ErrorCode, msg: string)     {
        return new ApiError(404, code, msg);
      }
      static conflict(code: ErrorCode, msg: string)     {
        return new ApiError(409, code, msg);
      }
    }