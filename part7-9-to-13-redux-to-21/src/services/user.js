import axios from 'axios'
const baseUrl = '/api/user'

const login = async (username, password) => {
    try {
        const res = await axios.post('/api/login', {
            username,
            password,
        })
        window.localStorage.setItem('token', JSON.stringify(res.data.token))
        window.localStorage.setItem(
            'username',
            JSON.stringify(res.data.username)
        )
        window.localStorage.setItem('name', JSON.stringify(res.data.name))
        return { ok: true, token: res.data.token }
    } catch (error) {
        return {
            ok: false,
            error: error.response?.data.error || 'Login Failed',
        }
    }
}

const getAll = async () => {
    try {
        const res = await axios.get(baseUrl)
        return { ok: true, users: res.data }
    } catch (error) {
        return {
            ok: false,
            error: error.response?.data.error || 'Fetch users failed',
        }
    }
}

export default { login, getAll }
