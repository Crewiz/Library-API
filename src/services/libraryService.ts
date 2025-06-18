import { PrismaClient } from '@prisma/client';
import { Book } from "../models/book";
import { Rental } from "../models/rental";
import { ApiError, ErrorCode } from "../middleware/apiError";

const prisma = new PrismaClient();

export async function listBooks(): Promise<Book[]> {
  const books = await prisma.book.findMany({
    include: { rentals: { where: { returnedAt: null } } },
  });
  return books.map(b => ({
    isbn: b.isbn,
    title: b.title,
    author: b.author,
    publishedYear: b.publishedYear,
    description: b.description,
    totalCopies: b.totalCopies,
    availableCopies: b.totalCopies - b.rentals.length,
  }));
}

export async function getBookByIsbn(isbn: string): Promise<Book> {
  const b = await prisma.book.findUnique({
    where: { isbn },
    include: { rentals: { where: { returnedAt: null } } },
  });
  if (!b) {
    throw ApiError.notFound(
      ErrorCode.BOOK_NOT_FOUND,
      `Book ${isbn} not found`
    );
  }
  return {
    isbn: b.isbn,
    title: b.title,
    author: b.author,
    publishedYear: b.publishedYear,
    description: b.description,
    totalCopies: b.totalCopies,
    availableCopies: b.totalCopies - b.rentals.length,
  };
}

export async function createRental(
  isbn: string,
  userId: string
): Promise<Rental> {
  const b = await prisma.book.findUnique({
    where: { isbn },
    include: { rentals: { where: { returnedAt: null } } },
  });
  if (!b) {
    throw ApiError.notFound(
      ErrorCode.BOOK_NOT_FOUND,
      `Book ${isbn} not found`
    );
  }
  if (b.totalCopies - b.rentals.length <= 0) {
    throw ApiError.conflict(
      ErrorCode.NO_COPIES_AVAILABLE,
      `No copies of ${isbn} available`
    );
  }
  const rental = await prisma.rental.create({
    data: { bookIsbn: isbn, userId },
  });
  return {
    id: rental.id,
    bookIsbn: rental.bookIsbn,
    userId: rental.userId,
    rentedAt: rental.rentedAt,
    returnedAt: null,
  };
}

export async function returnRental(
  rentalId: string
): Promise<Rental> {
  const r = await prisma.rental.findUnique({ where: { id: rentalId } });
  if (!r) {
    throw ApiError.notFound(
      ErrorCode.RENTAL_NOT_FOUND,
      `Rental ${rentalId} not found`
    );
  }
  if (r.returnedAt) {
    throw ApiError.conflict(
      ErrorCode.RENTAL_ALREADY_RETURNED,
      `Rental ${rentalId} already returned`
    );
  }
  const updated = await prisma.rental.update({
    where: { id: rentalId },
    data: { returnedAt: new Date() },
  });
  return {
    id: updated.id,
    bookIsbn: updated.bookIsbn,
    userId: updated.userId,
    rentedAt: updated.rentedAt,
    returnedAt: updated.returnedAt,
  };
}

export type listUserRentals = {
  id: string;
  rentedAt: Date;
  returnedAt: Date | null;
  book: Book;
};

export async function listUserRentals(
  userId: string
): Promise<listUserRentals[]> {
  const rentals = await prisma.rental.findMany({
    where: { userId, returnedAt: null },
    include: {
      book: {
        include: { rentals: { where: { returnedAt: null } } },
      },
    },
  });

  return rentals.map(r => ({
    id: r.id,
    rentedAt: r.rentedAt,
    returnedAt: r.returnedAt ?? null,
    book: {
      isbn: r.book.isbn,
      title: r.book.title,
      author: r.book.author,
      publishedYear: r.book.publishedYear,
      description: r.book.description,
      totalCopies: r.book.totalCopies,
      availableCopies: r.book.totalCopies - r.book.rentals.length,
    },
  }));
}
