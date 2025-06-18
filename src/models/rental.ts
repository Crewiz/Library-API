export interface Rental {
    id: string;
    bookIsbn: string;
    userId: string;
    rentedAt: Date;
    returnedAt: Date | null;
  }