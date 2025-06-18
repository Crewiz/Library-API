-- CreateTable
CREATE TABLE "Book" (
    "isbn" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publishedYear" INTEGER NOT NULL,
    "totalCopies" INTEGER NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookIsbn" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rentedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" DATETIME,
    CONSTRAINT "Rental_bookIsbn_fkey" FOREIGN KEY ("bookIsbn") REFERENCES "Book" ("isbn") ON DELETE RESTRICT ON UPDATE CASCADE
);
