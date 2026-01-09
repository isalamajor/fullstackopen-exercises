import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import PostBlogForm from './components/PostBlogForm'
import blogService from './services/blogs'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)

  const [showAddBlog, setShowAddBlog] = useState(false)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [token, setToken] = useState(null)

  const fetchBlogs = async () => {
    const res = await blogService.getAll()
    if (res.ok) {
      setBlogs(res.blogs.sort((a, b) => b.likes - a.likes))
    }
    else setErrorMessage(res.error)
  }

  useEffect(() => {
    const tokenLs = window.localStorage.getItem('token')
    if (tokenLs) {
      setToken(JSON.parse(tokenLs))
      fetchBlogs()
    }
  }, [])

  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(null), 5000)
  }

  const logout = () => {
    window.localStorage.clear()
    setUsername('')
    setPassword('')
    setBlogs([])
    setToken(null)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    const res = await blogService.login(username, password)
    if (res.ok) {
      setToken(res.token)
      fetchBlogs()
    } else {
      console.log('errorlog', res.error)
      setErrorMessage(res.error)
    }
  }

  const handlePostBlog = async (title, author, url) => {
    if (title && author && url) {
      const res = await blogService.postBlog({ title, author, url })
      if (res.ok) {
        setBlogs([...blogs, res.blog])
        showNotification(`New blog ${title} was added`)
      } else {
        setErrorMessage(res.error)
      }
    }
  }

  const handleBlogLiked = async (blog) => {
    const res = await blogService.updateBlog({ ...blog, likes: blog.likes + 1 })

    if (res.ok) {
      const blogsUpdated = blogs.map(b => {
        if (b.id === blog.id) {
          b.likes += 1
        }
        return b
      })
      setBlogs(blogsUpdated)
    } else {
      setErrorMessage(res.error)
    }
  }

  return (
    <>
      <h1>Blogs App</h1>
      <p style={{ display: 'inline-block', marginRight: '10px', color: 'red', fontWeight: 'bold' }}>
        {errorMessage}
      </p>
      <p style={{ display: 'inline-block', color: 'green', fontWeight: 'bold' }}>
        {notification}
      </p>
      {
        !token ?
          /* Login Form */
          <>
            <h1>Login to BlogsApp</h1>
            <form onSubmit={handleLogin}>
              <div>
                username
                <input
                  type="text"
                  value={username}
                  name="Username"
                  placeholder='Username'
                  onChange={({ target }) => { setUsername(target.value); setErrorMessage(null) }}
                />
              </div>
              <div>
                password
                <input
                  type="password"
                  value={password}
                  name="Password"
                  placeholder='Password'
                  onChange={({ target }) => { setPassword(target.value); setErrorMessage(null) }}
                />
              </div>
              <button type="submit">login</button>
            </form>
          </>
          :
          /* Blogs */
          <div>
            <button onClick={() => logout()}>Logout</button>
            <h2>Blogs List</h2>
            {blogs.map(blog =>
              <Blog key={blog.id} blog={blog}
                onBlogLiked={() => handleBlogLiked(blog)}
                onBlogDeleted={() => {
                  const blogsUpdated = blogs.filter(b => b.id !== blog.id)
                  setBlogs(blogsUpdated)
                }}
              />
            )}
            {showAddBlog ?
              <>
                <PostBlogForm onSubmit={handlePostBlog} />
                <button onClick={() => setShowAddBlog(false)}>Cancel</button>
              </>
              :
              <button onClick={() => setShowAddBlog(true)}>Add Blog</button>
            }
          </div>
      }
    </>
  )
}


export default App