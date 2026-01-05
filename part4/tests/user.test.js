const mongoose = require('mongoose')
const { test, describe, after, beforeEach, expect } = require('node:test')
const bcrypt = require('bcrypt')
const assert = require('node:assert')
const supertest = require('supertest')
const app =  require('../app')
const User = require('../models/user')

const api = supertest(app)


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

const testUser = {
    username: 'nuevito',
    name: 'Pablo Mirasierra',
    password: 'miramira1030'
}

describe('users', () => {
     
    beforeEach(async () => {
        await User.deleteMany({})
        
        for (let user of initialUsers) {
            const passwordHash = await bcrypt.hash(user.password, 10)
            let userObject = new User({ 
            username: user.username,
            name: user.name,
            passwordHash: passwordHash
            })
            await userObject.save()
        }
    })

    test('get all users', async () => {
      const res = await api
        .get('/api/user')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(res.body.length, initialUsers.length)
    })

    test('add user', async() => {
        const res = await api
            .post('/api/user')
            .send(testUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const resGet = await api.get('/api/user')

        assert.strictEqual(initialUsers.length + 1, resGet.body.length)
    })

    test('password too short', async() => {
        const res = await api
            .post('/api/user')
            .send({
                username: 'nuevito',
                name: 'Pablo Mirasierra',
                password: 'mi'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const resGet = await api.get('/api/user')
        assert.strictEqual(initialUsers.length, resGet.body.length)
    })

    test('username too short', async() => {
        const res = await api
            .post('/api/user')
            .send({
                username: 'nu',
                name: 'Pablo Mirasierra',
                password: 'mirasar1231'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const resGet = await api.get('/api/user')
        assert.strictEqual(initialUsers.length, resGet.body.length)
    })
})


after(async () => {
  await mongoose.connection.close()
})