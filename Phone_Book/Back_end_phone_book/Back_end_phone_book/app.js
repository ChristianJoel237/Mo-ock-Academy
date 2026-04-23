const express = require('express');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const personRouter = require('./controllers/persons');

const app = express();

logger.info('connecting to ', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MONGODB');
  })
  .catch((error) => {
    logger.error('error connection to MongoDB', error.message);
  });

app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);
app.get('/test', (req, res) => res.send('OK'));
app.use('/api/persons', personRouter);

app.use(middleware.unKnownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
