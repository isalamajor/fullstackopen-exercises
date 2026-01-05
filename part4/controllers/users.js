const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')


userRouter.get('/', async(request, response) => {
    try {
        const users = await User.find()
        return response.status(200).send(users)
    } catch (error) {
        return response.status(400).json({
            error: error
        })
    }
})

userRouter.post('/', async(request, response) => {
    try {
        const { username, name, password } = request.body
        if (!username || !name || !password) {
          return response.status(400).json({
            error: 'Missing fields. Fields required: username, name, password'
          })
        }

        if (username.length < 3) {
          return response.status(400).json({
            message: 'Username must be at least 3 characters long'
          })
        }
        if (password.length < 3) {
          return response.status(400).json({
            message: 'Password must be at least 3 characters long'
          })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({ username, name, passwordHash })
        const userCreated = await user.save(user)
        if (userCreated) return response.status(201).send(userCreated)
        return response.status(400).json({
          error: error
        })
    } catch (error) {
        return response.status(400).json({
            error: error
        })
    }
})


module.exports = userRouter