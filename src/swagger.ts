export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Lending API',
      version: '1.0.0',
      description: 'API for renting and returning books',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local dev server',
      },
      {
        url: '{protocol}://{host}/{basePath}',
        description: 'Template server (also localhost)',
        variables: {
          protocol: { default: 'http', enum: ['http', 'https'] },
          host:     { default: 'localhost:3000' },
          basePath: { default: 'v1' },
        },
      },
    ],
    tags: [
      { name: 'Books',    description: 'Operations on books' },
      { name: 'Rentals',  description: 'Renting & returning books' },
    ],
    components: {
      schemas: {
        Book: {
          type: 'object',
          properties: {
            isbn:          { type: 'string' },
            title:         { type: 'string' },
            author:        { type: 'string' },
            publishedYear: { type: 'integer' },
            totalCopies:   { type: 'integer' },
            description:   { type: 'string' },
            availableCopies:{ type: 'integer' },
          },
          required: [
            'isbn','title','author',
            'publishedYear','totalCopies',
            'description','availableCopies'
          ],
        },
        Rental: {
          type: 'object',
          properties: {
            id:        { type: 'string' },
            bookIsbn:  { type: 'string' },
            userId:    { type: 'string' },
            rentedAt:  { type: 'string', format: 'date-time' },
            returnedAt: {
              oneOf: [
                { type: 'string', format: 'date-time' },
                { type: 'null' }
              ]
            },
          },
          required: ['id','bookIsbn','userId','rentedAt'],
        },
        UserRental: {
          type: 'object',
          properties: {
            rentalId:   { type: 'string' },
            rentedAt:   { type: 'string', format: 'date-time' },
            returnedAt: {
              oneOf: [
                { type: 'string', format: 'date-time' },
                { type: 'null' }
              ]
            },
            book:       { $ref: '#/components/schemas/Book' },
          },
          required: ['rentalId','rentedAt','book'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status:  { type: 'integer' },
            code:    { type: 'string' },
            message: { type: 'string' },
          },
          required: ['status','code','message'],
          example: {
            status: 404,
            code: 'BOOK_NOT_FOUND',
            message: 'Book 978-0544003415 not found'
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Invalid request data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                status: 400,
                code: 'INVALID_INPUT',
                message: '`userId` is required in request body'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                status: 404,
                code: 'BOOK_NOT_FOUND',
                message: 'Book does-not-exist not found'
              }
            }
          }
        },
        Conflict: {
          description: 'Conflict with current state',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                status: 409,
                code: 'NO_COPIES_AVAILABLE',
                message: 'No copies of 978-0544003415 available'
              }
            }
          }
        },
        InternalServerError: {
          description: 'Unexpected server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: {
                status: 500,
                code: 'INTERNAL_SERVER_ERROR',
                message: 'An unexpected error occurred'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'],
};