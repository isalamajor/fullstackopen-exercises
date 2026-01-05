const mongoose = require('mongoose')
const { test, describe, after, beforeEach } = require('node:test')
const bcrypt = require('bcrypt')
const assert = require('node:assert')
const supertest = require('supertest')
const app =  require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  },
  {
      _id: '5a422aa71b54a676234d17f2',
      title: 'Read the saga Blackwater',
      author: 'IsabelHdez',
      url: 'https://homepages.cwi.nl/brokenLink.pdf',
      likes: 15,
      __v: 0
  },
  {
      _id: '5a422aa71b54a676234d17f3',
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 2,
      __v: 0
  }
]

const initialUsers = [
  {
    username: 'isaplus',
    name: 'Isabel Hernandez',
    password: 'caskcnaskj312'
  },
  {
    username: 'anita123',
    name: 'Ana Mena',
    password: ' 039904xxlsla'
  }
]

const testBlog = {
    title: 'Blog added for the test 1',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5
}

describe('blogs', () => {

  let blogs = []
  let users = []

  beforeEach(async () => {
    await User.deleteMany({})
    users = []

    for (let user of initialUsers) {
      const passwordHash = await bcrypt.hash(user.password, 10)
      let userObject = new User({ 
        username: user.username,
        name: user.name,
        passwordHash: passwordHash
      })
      await userObject.save()
      users.push(userObject)
    }
    
    await Blog.deleteMany({})
    blogs = []

    for (let note of initialBlogs) {
      let blogObject = new Blog(note)
      blogObject.user = users[0].id
      await blogObject.save()
      blogs.push(blogObject)
    }
  })
    
  test.only('get all blogs', async () => {
    
    const res = await api
      .get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    console.log(res.body)

    assert.strictEqual(res.body.length, initialBlogs.length)
  })


  test('a valid blog can be added ', async () => {
    const login = await api
      .post('/api/login')
      .send({ username: 'isaplus', password: 'caskcnaskj312' })
      .expect(200)

    await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsUpdated = await api.get('/api/blog')

    const titles = blogsUpdated.body.map(r => r.title)

    assert.strictEqual(blogsUpdated.body.length, initialBlogs.length + 1)

    assert(titles.includes('Blog added for the test 1'))
  })



  test('if blog without likes is be added, likes is set to 0 by default', async () => {
    const noLikesBlog = {
      title: 'noLikesBlog',
      author: 'test',
      url: 'fakeUrl'
    }
    const login = await api
      .post('/api/login')
      .send({ username: 'isaplus', password: 'caskcnaskj312' })
      .expect(200)
  
    await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(noLikesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsUpdated = await api.get('/api/blog')
    const addedBlog = blogsUpdated.body.find(r => r.title === 'noLikesBlog')

    assert.strictEqual(addedBlog.likes, 0)
  })



  test('fields missing, bad request 400', async () => {
    const invalidBlog = {
      author: 'test'
    }
    const login = await api
      .post('/api/login')
      .send({ username: 'isaplus', password: 'caskcnaskj312' })
      .expect(200)
  
    await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(invalidBlog)
      .expect(400)
  })


  test('blog without content is not added', async () => {
    const newBlog = {
      likes: 1
    }
    const login = await api
      .post('/api/login')
      .send({ username: 'isaplus', password: 'caskcnaskj312' })
      .expect(200)
  
    await api
      .post('/api/blog')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blog')

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('post method with no auth fails', async() => {
    await api
      .post('/api/blog')
      .send(testBlog)
      .expect(401)
  })


  test('la propiedad de id existe y no _id', async () => {
    const blog = new Blog(testBlog);
    await blog.save();

    const jsonBlog = blog.toJSON();

    assert.ok(jsonBlog.id)
    assert.strictEqual(jsonBlog._id, undefined)
  });


  test('delete a blog valid user', async() => {
    const login = await api
      .post('/api/login')
      .send({ username: 'isaplus', password: 'caskcnaskj312' })
      .expect(200)
  
    const resGet = await api.get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const id = resGet.body[0].id

    await api.delete(`/api/blog/${id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(204)
        
    const resGetAfter = await api.get('/api/blog')
    assert.equal(resGet.body.length - 1, resGetAfter.body.length)
  })

  test('delete a blog invalid user', async() => {
    const login = await api
      .post('/api/login')
      .send({ username: 'anita123', password: ' 039904xxlsla'})
      .expect(200)
  
    const resGet = await api.get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const id = resGet.body[0].id

    await api
      .delete(`/api/blog/${id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(401)
        
    const resGetAfter = await api.get('/api/blog')
    assert.equal(resGet.body.length, resGetAfter.body.length)
  })

  test('delete a blog no auth', async() => {
    const resGet = await api.get('/api/blog')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const id = resGet.body[0].id

    await api
      .delete(`/api/blog/${id}`)
      .expect(401)
        
    const resGetAfter = await api.get('/api/blog')
    assert.equal(resGet.body.length, resGetAfter.body.length)
  })

  test('update a register', async() => {
    const resGet = await api.get('/api/blog')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const blogObject = resGet.body[0]
    const blogId = blogObject.id
    blogObject.likes = 33
    delete blogObject.id
    
    const login = await api
      .post('/api/login')
      .send({ username: 'isaplus', password: 'caskcnaskj312' })
      .expect(200)
  
    const res = await api.put(`/api/blog/${blogId}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(blogObject)
      .expect(200)
      .expect('Content-Type', /application\/json/)
        
    const resGetAfter = await api.get('/api/blog')
    assert.equal(res.body.likes, 33)
  })

})


after(async () => {
  await mongoose.connection.close()
})