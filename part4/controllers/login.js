const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  try {
      
    const { username, password } = request.body

    if (!username || !password) {
      return response.status(400).json({
        error: 'Missing fields. Fields required: username, password.'
      })
    }

    const user = await User.findOne({ username })

    if (!user) {
      return response.status(404).json({
        error: 'invalid username'
      })
    }
    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
      return response.status(401).json({
        error: 'invalid password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    response
      .status(200)
      .send({ token: token, username: user.username, name: user.name })
    
  } catch (error) {
    console.log('Login Error:', error)
    response
      .status(400).end()
  }
})


module.exports = loginRouter