import { Router } from 'express';
import * as booksCtrl from '../controllers/booksController';
import * as usersCtrl from '../controllers/usersController';
import { validateRentBookBody, validateParams } from '../middleware/validateRequest';

const router = Router();

/**
 * @openapi
 * /v1/books:
 *   get:
 *     tags:
 *       - Books
 *     summary: List all books
 *     responses:
 *       '200':
 *         description: A list of books with availability
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *             example:
 *               - isbn: "978-0452284234"
 *                 title: "1984"
 *                 author: "George Orwell"
 *                 publishedYear: 1949
 *                 totalCopies: 3
 *                 description: "A dystopian novel about totalitarian control in a future society where Big Brother watches all citizens and truth is constantly rewritten."
 *                 availableCopies: 3
 */
router.get(
  '/v1/books',
  booksCtrl.listBooks
);

/**
 * @openapi
 * /v1/books/{isbn}:
 *   get:
 *     tags:
 *       - Books
 *     summary: Get a single book by ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *             example:
 *               isbn: "978-0452284234"
 *               title: "1984"
 *               author: "George Orwell"
 *               publishedYear: 1949
 *               totalCopies: 3
 *               description: "A dystopian novel about totalitarian control in a future society where Big Brother watches all citizens and truth is constantly rewritten."
 *               availableCopies: 2
 *       '400':
 *         $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/v1/books/:isbn',
  validateParams('isbn'),
  booksCtrl.getBook
);

/**
 * @openapi
 * /v1/books/{isbn}/rent:
 *   post:
 *     tags:
 *       - Rentals
 *     summary: Rent a book
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *             required:
 *               - userId
 *           example:
 *             userId: "alice123"
 *     responses:
 *       '201':
 *         description: Rental created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *             example:
 *               id: "abcd-1234-ef56"
 *               bookIsbn: "978-0452284234"
 *               userId: "alice123"
 *               rentedAt: "2025-06-18T16:48:00.965Z"
 *       '400':
 *         $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/v1/books/:isbn/rent',
  validateParams('isbn'),
  validateRentBookBody,
  booksCtrl.rentBook
);

/**
 * @openapi
 * /v1/users/{userId}/rentals:
 *   get:
 *     tags:
 *       - Rentals
 *     summary: List active rentals for a user, including book details
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Array of rentals with book info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRental'
 *             example:
 *               - rentalId: "abcd-1234"
 *                 rentedAt: "2025-06-18T16:48:00.965Z"
 *                 returnedAt: null
 *                 book:
 *                   isbn: "978-0452284234"
 *                   title: "1984"
 *                   author: "George Orwell"
 *                   publishedYear: 1949
 *                   totalCopies: 3
 *                   description: "A dystopian novel about totalitarian control in a future society where Big Brother watches all citizens and truth is constantly rewritten."
 *                   availableCopies: 2
 *       '400':
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/v1/users/:userId/rentals',
  validateParams('userId'),
  usersCtrl.listUserRentals
);

/**
 * @openapi
 * /v1/rentals/{rentalId}/return:
 *   post:
 *     tags:
 *       - Rentals
 *     summary: Return a rental (no content)
 *     parameters:
 *       - in: path
 *         name: rentalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Rental returned successfully
 *       '400':
 *         $ref: '#/components/schemas/ErrorResponse'
 *       '404':
 *         $ref: '#/components/schemas/ErrorResponse'
 *       '409':
 *         $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/v1/rentals/:rentalId/return',
  validateParams('rentalId'),
  usersCtrl.returnBook
);

export default router;
