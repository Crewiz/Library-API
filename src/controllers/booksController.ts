import { Request, Response, NextFunction } from 'express';
import * as libraryService from '../services/libraryService';

export const listBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const all = await libraryService.listBooks();
    res.json(all);
  } catch (err) {
    next(err);
  }
};

export const getBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isbn } = req.params;
  try {
    const book = await libraryService.getBookByIsbn(isbn);
    res.json(book);
  } catch (err) {
    next(err);
  }
};

export const rentBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isbn } = req.params;
  const { userId } = req.body;

  try {
    const rental = await libraryService.createRental(isbn, userId);
    res.status(201).json(rental);
  } catch (err) {
    next(err);
  }
};
