import cors from 'cors';
import express from 'express';
import './config/envConf.js'; // import env variables before importing other modules
import './config/axiosConf.js';

// routes
import blockchain from './routes/blockchain.js';

// db connection
import './config/db.js';
import { httpLogger, logger } from './utils/logger.js';

// middlewares
import { errorResponseHandler } from './middlewares/error.js';
import { envConfig } from './config/envConf.js';
import {
  camelCaseRequest,
  pascalCaseResponse,
} from './middlewares/caseConverter.js';

// swagger
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerDef from './docs/swaggerDef.js';
import swaggerUi from 'swagger-ui-express';

// express config
const PORT = envConfig.PORT || 3000;
const app = express();

app.use(express.json());
app.use(httpLogger);
app.use(cors(JSON.parse(envConfig.CORS_CONFIG)));

// perform case conversion
app.use(camelCaseRequest);
app.use(pascalCaseResponse);

// configure swagger
const swaggerSpec = swaggerJSDoc({
  definition: swaggerDef,
  apis: ['./services/*.js'],
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// mount each of the routes here
app.use('/blockchain', blockchain);

// finally the error handler on the chain
app.use(errorResponseHandler);

// server conf and global error handling
const server = app.listen(
  PORT,
  logger.info(`Server started in ${PORT} on ${envConfig.NODE_ENV} mode...`)
);

process.on('unhandledRejection', (error, promise) => {
  logger.error(error);
  server.close(() => {
    process.exit(1);
  });
});
