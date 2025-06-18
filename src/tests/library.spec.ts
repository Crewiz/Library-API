import request from 'supertest';

const baseUrl = 'http://localhost:3000';

function expectError(
  res: request.Response,
  code: string,
  status: number,
  message: string
) {
  expect(res.body).toEqual({ status, code, message });
}

function expectDateString(dateStr: unknown) {
  expect(typeof dateStr).toBe('string');
  expect(new Date(dateStr as string).toString()).not.toBe('Invalid Date');
}

describe('Library API – full endpoint coverage', () => {
  const seedIsbn1 = '978-0452284234'; // totalCopies = 3
  const seedIsbn2 = '978-0544003415'; // totalCopies = 1
  let rentalId: string;

  // listar alla seedade böcker
  it('lists all seeded books', async () => {
    const res = await request(baseUrl).get('/v1/books').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          isbn: seedIsbn1,
          totalCopies: expect.any(Number),
          availableCopies: expect.any(Number),
        }),
        expect.objectContaining({ isbn: seedIsbn2 }),
      ])
    );
  });

  // hämtar bok via ISBN och 404 om den saknas
  it('returns a book by ISBN and 404 for missing one', async () => {
    const ok = await request(baseUrl)
      .get(`/v1/books/${seedIsbn1}`)
      .expect(200);
    expect(ok.body).toMatchObject({ isbn: seedIsbn1 });
    expect(typeof ok.body.title).toBe('string');

    const notfound = await request(baseUrl)
      .get('/v1/books/does-not-exist')
      .expect(404);
    expectError(
      notfound,
      'BOOK_NOT_FOUND',
      404,
      'Book does-not-exist not found'
    );
  });

  // initialt inga hyrningar för icke-existerande user
  it('initially returns empty rentals array', async () => {
    const res = await request(baseUrl)
      .get('/v1/users/nobody/rentals')
      .expect(200);
    expect(res.body).toEqual([]);
  });

  // skapa lån och 404 för ogiltigt return-id
  it('creates a rental, then 404 if returning fake ID', async () => {
    const rent = await request(baseUrl)
      .post(`/v1/books/${seedIsbn2}/rent`)
      .send({ userId: 'charlie' })
      .expect(201);
    // property-level checks
    expect(rent.body).toMatchObject({
      bookIsbn: seedIsbn2,
      userId: 'charlie',
      returnedAt: null,
    });
    expectDateString(rent.body.rentedAt);
    rentalId = rent.body.id;

    const bogus = await request(baseUrl)
      .post('/v1/rentals/not-a-real-id/return')
      .expect(404);
    expectError(
      bogus,
      'RENTAL_NOT_FOUND',
      404,
      'Rental not-a-real-id not found'
    );
  });

  // inga exemplar kvar, en retur, dubbel retur, validera body
  it('rejects second rent, allows return, rejects double return, enforces body validation', async () => {
    // inga exemplar kvar
    const noCopies = await request(baseUrl)
      .post(`/v1/books/${seedIsbn2}/rent`)
      .send({ userId: 'dana' })
      .expect(409);
    expectError(
      noCopies,
      'NO_COPIES_AVAILABLE',
      409,
      `No copies of ${seedIsbn2} available`
    );

    // lämna tillbaka en gång
    await request(baseUrl)
      .post(`/v1/rentals/${rentalId}/return`)
      .expect(204);

    // lämna tillbaka igen
    const second = await request(baseUrl)
      .post(`/v1/rentals/${rentalId}/return`)
      .expect(409);
    expectError(
      second,
      'RENTAL_ALREADY_RETURNED',
      409,
      `Rental ${rentalId} already returned`
    );

    // ingen userId
    const bad = await request(baseUrl)
      .post(`/v1/books/${seedIsbn1}/rent`)
      .send({})
      .expect(400);
    expectError(
      bad,
      'INVALID_INPUT',
      400,
      '`userId` is required in request body'
    );
  });
});
