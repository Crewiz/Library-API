# Library API

A simple REST API for managing books and rentals in a small library.
Built with Node.js, Express, TypeScript, Prisma (SQLite), and documented using Swagger.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

Create a `.env` file in the root directory with:

```env
DATABASE_URL="file:./dev.db"
```

### 3. Seed the database

```bash
npm run seed
```

### 4. Start the development server

```bash
npm run dev
```

The API will be running at:

```
http://localhost:3000
```

### 5. View API documentation

Swagger UI is available at:

```
http://localhost:3000/docs
```

---

## API Endpoints

| Method | Endpoint                       | Description                    |
| ------ | ------------------------------ | ------------------------------ |
| GET    | `/v1/books`                    | List all books                 |
| GET    | `/v1/books/:isbn`              | Get details of a specific book |
| POST   | `/v1/books/:isbn/rent`         | Rent a book (body: `userId`)   |
| GET    | `/v1/users/:userId/rentals`    | List books rented by a user    |
| POST   | `/v1/rentals/:rentalId/return` | Return a rented book           |

---

## Running Tests

This project uses Jest and Supertest for testing core functionality.

To run tests:

```bash
npm test
```

Make sure to seed the DB and start the server before running tests.

---

## Tech Stack

* **TypeScript** + **Express**
* **Prisma ORM** with **SQLite**
* **Jest** + **Supertest** for testing
* **Swagger UI** for API docs

---

## Run with Docker

1. **Build the image**

   ```bash
   docker build -t library-api .
   ```

2. **Run the container**

   ```bash
   docker run -d \
     -p 3000:3000 \
     -e DATABASE_URL="file:./dev.db" \
     -v "$(pwd)/dev.db:/app/dev.db" \
     --name library-api \
     library-api
   ```

   * `-e DATABASE_URL="file:./dev.db"` ensures Prisma points at the mounted file
   * `-v "$(pwd)/dev.db:/app/dev.db"` persists the SQLite database on your host
   * The API will be live at `http://localhost:3000/`

3. **View Swagger UI**

   ```bash
   http://localhost:3000/docs
   ```

---

## 📂 Project Structure

```
├── prisma/              # Prisma schema and seed
├── src/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Error & validation middleware
│   ├── services/        # Business logic (libraryService.ts)
│   ├── routes/          # API route definitions
│   └── index.ts         # App entrypoint
├── tests/               # Unit tests
├── .env                 # Environment config
├── package.json
├── tsconfig.json
└── README.md
```

---

## Status

All base features and endpoints are implemented. Bonus features included:

* SQLite persistence with Prisma
* Swagger documentation
* Docker config

---