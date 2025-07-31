import cors from 'cors';
import express from 'express';
import './config/envConf.js'; // import env variables before importing other modules

// routes
import blockchain from './routes/blockchain.js';
import control from './routes/control.js';
import mining from './routes/mining.js';
import network from './routes/network.js';

import { httpLogger, logger } from './utils/logger.js';

import errorResponseHandler from './errors/errorResponseHandler.js';
// middlewares
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
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'BTC Trace API Docs',
    customfavIcon: 'https://avatars.githubusercontent.com/u/223154378?v=4',
    customCssUrl: '/static/swagger-custom.css',
  })
);

// serve public folder
app.use('/static', express.static('public'));

// mount each of the routes here
app.use('/blockchain', blockchain);
app.use('/control', control);
app.use('/mining', mining);
app.use('/network', network);

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
