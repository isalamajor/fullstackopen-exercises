import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../reducers/loginReducer'
import { fetchBlogs } from '../reducers/blogReducer'
import { fetchUsers } from '../reducers/userReducer'

export const LoginForm = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const checkForToken = () => {
        const tokenLs = window.localStorage.getItem('token')
        if (tokenLs) {
            dispatch(fetchBlogs())
            dispatch(fetchUsers())
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        await dispatch(login(username, password))
        checkForToken()
        navigate('/')
    }
    return (
        <>
            <h1>Login to BlogsApp</h1>
            <form onSubmit={(e) => handleLogin(e)}>
                <div class="form-group">
                    <div>
                        Username
                        <input
                            type="text"
                            value={username}
                            name="Username"
                            placeholder="Username"
                            onChange={({ target }) => {
                                setUsername(target.value)
                            }}
                            class="form-control"
                        />
                    </div>
                    <div>
                        Password
                        <input
                            type="password"
                            value={password}
                            name="Password"
                            placeholder="Password"
                            onChange={({ target }) => {
                                setPassword(target.value)
                            }}
                            class="form-control"
                        />
                    </div>
                    <button type="submit" class="btn btn-primary mt-2">
                        Login
                    </button>
                </div>
            </form>
        </>
    )
}
