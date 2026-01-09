const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// Reset y crear blogs de prueba
testingRouter.post('/reset-and-seed', async (req, res) => {
    try {
        // Limpiamos blogs y usuarios
        await Blog.deleteMany({})
        await User.deleteMany({})

        // Creamos 10 blogs de prueba con likes del 1 al 10
        const blogs = []
        for (let i = 1; i <= 10; i++) {
            blogs.push(new Blog({
                title: `Blog ${i}`,
                author: `Author ${i}`,
                url: `http://example.com/blog${i}`,
                likes: i
            }))
        }

        // Guardamos todos los blogs
        await Blog.insertMany(blogs)

        return res.status(201).json({ message: 'Test database seeded with 10 blogs' })
    } catch (error) {
        console.error(error)
        return res.status(400).json({ error: 'Error seeding test database' })
    }
})

testingRouter.post('/reset', async (request, response) => {
    try {
        await Blog.deleteMany({})
        await User.deleteMany({})
        return response.status(204).end()
    } catch (error) {
        return response.status(400).json({ error: 'Error resetting test database' })
    }
})

module.exports = testingRouter