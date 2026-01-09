const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info('Connecting to ', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
        .then(() => { logger.info('Connected to MongoDB') })
        .catch(error => { logger.error('Error connecting to MongoDB:', error) })

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use(middleware.responseLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)

console.log('routed')

if (process.env.NODE_ENV === 'test') {
        app.use('/api/testing', testingRouter)
        console.log('routed with reset')

}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app