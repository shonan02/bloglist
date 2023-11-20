const logger = require('./logger')
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---')
  next();
}

const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: 'unknown endpoint' });

  next();
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const auth = req.header('Authorization');
  if(auth && auth.toLowerCase().startsWith('bearer')) {
      const token = auth.replace('Bearer ', '');
      const verified = jwt.verify(token, process.env.SECRET);
      req.token = verified;
  }
  
  next();
}

const userExtractor = async (req, res, next) => {

  next();

}
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}