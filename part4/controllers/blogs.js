const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { requireAuth } = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate("user")
    if (blogs) return response.json(blogs)
    return response.status(400).end()
  } catch (error) {
    return response.status(400).end()
  }
})

blogRouter.post('/', requireAuth, async (request, response) => {
  try {
    const user = request.user

    if (!user || !user.id) {
      return response.status(401).json({ error: 'Invalid token' })
    }

    const newBlog = request.body
    if (!newBlog || !newBlog.title || !newBlog.author || !newBlog.url) {
      return response.status(400).json({ error: 'Missing Fields' })
    }

    newBlog.user = user.id
    const blog = new Blog(newBlog)
    const blogAdded = await blog.save()
    const res = await Blog.findById(blogAdded.id).populate('user')
    if (res) return response.status(201).json(res)
    return response.status(400).json({ error: 'Error posting blog' })
  } catch (error) {
    console.log(error)
    return response.status(400).json({ error: error.response?.data.error || 'Server Error' })
  }
})

blogRouter.delete('/:id', requireAuth, async (request, response) => {
  try {
    const user = request.user
    const blogId = request.params.id

    if (!user || !user.id) {
      return response.status(401).json({ error: 'Invalid token' })
    }

    const blog = await Blog.findById(blogId)

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    if (!blog.user || !blog.user.equals(user.id)) {
      return response.status(401).json({ error: 'Only its creator is authorized to delete a blog' })
    }

    await Blog.deleteOne({ _id: blogId })
    return response.status(204).end()
  } catch (error) {
    return response.status(400).end()
  }
})

blogRouter.put('/:id', requireAuth, async (request, response) => {
  try {
    const { title, author, url, likes = 0 } = request.body
    const id = request.params.id
    const user = request.user

    if (!user || !user.id) {
      return response.status(401).json({ error: 'Invalid token' })
    }

    if (!title || !author || !url) {
      return response.status(400).json({ error: 'Missing fields' })
    }

    const res = await Blog.findByIdAndUpdate(id,
      { title, author, url, likes }, // solo se actualizan estos campos
      { new: true }).populate("user")
    if (res) return response.status(200).json(res)
    return response.status(400).end()
  } catch (error) {
    console.log(error)
    return response.status(400).end()
  }
})

module.exports = blogRouter
