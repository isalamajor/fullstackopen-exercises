const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { requireAuth } = require('../utils/middleware')


const getDecodedToken = request => {  
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return jwt.verify(authorization.replace('Bearer ', ''), process.env.SECRET)
  }  
  return null
}

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
      return response.status(400).end()
    }

    newBlog.user = user.id
    const blog = new Blog(newBlog)
    const res = await blog.save()
    if (res) return response.status(201).json(res)
    return response.status(400).end()
  } catch(error) {
    console.log(error)
    return response.status(400).end()
  }
})

blogRouter.delete('/:id', requireAuth, async(request, response) => {
  try {
    const user = request.user
    const blogId = request.params.id

    if (!user ||!user.id) {    
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
  } catch(error) {
    return response.status(400).end()
  }
})

blogRouter.put('/:id', requireAuth, async (request, response) => {
  try {
    const updatedBlog = request.body
    const id = request.params.id
    const user = request.user

    if (!user ||!user.id) {    
      return response.status(401).json({ error: 'Invalid token' })  
    }

    if (!updatedBlog || !updatedBlog.title || !updatedBlog.author || !updatedBlog.url) {
      return response.status(400).json({ error: 'Missing fields' })
    }

    updatedBlog.user = user.id

    const res = await Blog.findByIdAndUpdate(id, updatedBlog, { new: true }).populate("user")
    if (res) return response.status(200).json(res)
    return response.status(400).end()
  } catch(error) {
    console.log(error)
    return response.status(400).end()
  }
})

module.exports = blogRouter
