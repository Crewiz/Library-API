import express from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger';
import { ApiError, ErrorCode } from './middleware/apiError';

const app = express();
app.use(express.json());

const specs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(routes);

app.use((req, _res, next) => {
    next(
        ApiError.notFound(
      ErrorCode.ROUTE_NOT_FOUND,
      `Route ${req.path} not found`
    ));
  });  
  
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));