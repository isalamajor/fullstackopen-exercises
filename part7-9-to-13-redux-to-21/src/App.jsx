import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import PostBlogForm from './components/PostBlogForm'
import { useSelector, useDispatch } from 'react-redux'
import { login, logout } from './reducers/loginReducer'
import { fetchBlogs } from './reducers/blogReducer'
import { fetchUsers } from './reducers/userReducer'
import UserList from './components/UserList'
import {
    BrowserRouter as Router,
    Link,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from 'react-router-dom'
import { LoginForm } from './components/LoginForm'
import BlogList from './components/BlogList'
import { UserInfo } from './components/UserInfo'

const Navigation = ({ username }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    return (
        <div class="navbar navbar-expand-lg navbar-light bg-light mb-5 d-flex justify-content-between align-items-center">
            <div>
                <Link to="/users" class="navbar-brand">
                    Users
                </Link>
                <Link to="/" class="navbar-brand">
                    Blogs
                </Link>
            </div>
            <div>
                <div class="navbar-brand">
                    {username && `${username} logged in`}
                </div>
                <button onClick={handleLogout} class="btn btn-dark">
                    Logout
                </button>
            </div>
        </div>
    )
}

const App = () => {
    const dispatch = useDispatch()
    const notification = useSelector((state) => state.notification)
    const blogs = useSelector((state) => state.blogs)
    const users = useSelector((state) => state.users)
    const userData = useSelector((state) => state.login)

    useEffect(() => {
        const tokenLs = window.localStorage.getItem('token')
        if (tokenLs) {
            dispatch(fetchBlogs())
            dispatch(fetchUsers())
        }
    }, [dispatch])

    return (
        <>
            <header>
                <div class="alert alert-info" role="alert">
                    <h1>Blogs for FullstackOpen</h1>
                </div>
                {notification.length > 0 && (
                    <div class="alert alert-primary " role="alert">
                        {notification}
                    </div>
                )}
            </header>
            <Router>
                {userData?.token && <Navigation username={userData.username} />}
                <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route
                        path="/users"
                        element={<UserList users={users} blogs={blogs} />}
                    />
                    <Route path="/users/:id" element={<UserInfo />} />
                    <Route path="/blogs/:id" element={<Blog />} />
                    <Route
                        path="/"
                        element={
                            userData?.token ? (
                                <BlogList />
                            ) : (
                                <Navigate replace to="/login" />
                            )
                        }
                    />
                </Routes>
            </Router>
        </>
    )
}

export default App
