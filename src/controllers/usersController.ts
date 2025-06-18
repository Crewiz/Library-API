import { Request, Response, NextFunction } from 'express';
import * as libraryService from '../services/libraryService';

export const listUserRentals = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  try {
    const rentals = await libraryService.listUserRentals(userId);

    const result = rentals.map(r => ({
      rentalId: r.id,
      rentedAt: r.rentedAt,
      returnedAt: r.returnedAt,
      book: r.book,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const returnBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { rentalId } = req.params;
  try {
    await libraryService.returnRental(rentalId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
