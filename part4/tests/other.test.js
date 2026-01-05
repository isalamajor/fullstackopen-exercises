const { test, describe } = require('node:test')
const assert = require('node:assert')
const {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
} = require('../utils/list_helper')

const blogs = [
  { title: "A", author: "Robert C. Martin", likes: 2 },
  { title: "B", author: "Edsger W. Dijkstra", likes: 5 },
  { title: "C", author: "Robert C. Martin", likes: 3 },
  { title: "D", author: "Robert C. Martin", likes: 4 },
  { title: "E", author: "Edsger W. Dijkstra", likes: 12 }
]

describe('total likes', () => {
  test('of empty list is 0', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('of a list with multiple blogs is calculated correctly', () => {
    assert.strictEqual(totalLikes(blogs), 26)
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(favoriteBlog([]), null)
  })

  test('of a list returns the blog with most likes', () => {
    assert.deepStrictEqual(favoriteBlog(blogs), { 
      title: "E", 
      author: "Edsger W. Dijkstra", 
      likes: 12 
    })
  })

  test('of a list with one blog returns that blog', () => {
    const single = [blogs[0]]
    assert.deepStrictEqual(favoriteBlog(single), { 
      title: "A", 
      author: "Robert C. Martin", 
      likes: 2 
    })
  })
})

describe('most blogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(mostBlogs([]), null)
  })

  test('of a list returns the author with most blogs', () => {
    assert.deepStrictEqual(mostBlogs(blogs), {
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
    assert.strictEqual(mostLikes([]), null)
  })

  test('of a list returns the author with most likes', () => {
    assert.deepStrictEqual(mostLikes(blogs), {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})
