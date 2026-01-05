const lodash = require('lodash')

const totalLikes = (blogs) => {
    return blogs.reduce( (sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if ( !blogs || blogs.length === 0 ) return null
    return blogs.reduce ((fav, blog) => {
        return (blog.likes > fav.likes) ? blog : fav
    }, blogs[0])
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  const grouped = lodash.countBy(blogs, 'author')  
  const maxAuthor = lodash.maxBy(Object.keys(grouped), author => grouped[author])

  return {
    author: maxAuthor,
    blogs: grouped[maxAuthor]
  }
}


const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  const grouped = lodash.groupBy(blogs, 'author')

  const likesPerAuthor = lodash.map(grouped, (authorBlogs, author) => ({
    author,
    likes: lodash.sumBy(authorBlogs, 'likes')
  }))
  return lodash.maxBy(likesPerAuthor, 'likes')
}


module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}