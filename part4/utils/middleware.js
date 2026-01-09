const jwt = require('jsonwebtoken')
const logger = require('./logger')

const requestLogger = (req, res, next) => {
  logger.info('Method: ', req.method),
    logger.info('Path: ', req.path),
    logger.info('Body: ', req.body)
  next()
}

const responseLogger = (req, res, next) => {
  res.on('finish', () => {
    logger.info('Status: ', res.statusCode)
  })
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
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


const tokenExtractor = (request, response, next) => {
  const token = request.get('authorization')

  if (token && token.startsWith('Bearer ')) {
    try {
      const decodedToken = jwt.verify(token.replace('Bearer ', ''), process.env.SECRET)
      request.user = decodedToken
    } catch (error) {
      return response.status(401).json({ error: 'Authentication failed. Token is Invalid.' })
    }
  }

  next()
}

const requireAuth = (request, response, next) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  next()
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  requireAuth,
  responseLogger
}