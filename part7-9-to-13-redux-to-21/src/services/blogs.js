import axios from 'axios'
const baseUrl = '/api/blog'

const getAll = async () => {
    try {
        const res = await axios.get(baseUrl)
        return { ok: true, blogs: res.data }
    } catch (error) {
        return {
            ok: false,
            error: error.response?.data.error || 'Blogs Fetching Failed',
        }
    }
}

const postBlog = async (newObject) => {
    try {
        const token = JSON.parse(window.localStorage.getItem('token') || '')
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        }
        const response = await axios.post(baseUrl, newObject, config)

        if (response.status === 201) {
            return { ok: true, blog: response.data }
        }

        return {
            ok: false,
            error: response.data.error || 'Blog Posting Failed',
        }
    } catch (error) {
        return {
            ok: false,
            error: error.response?.data.error || 'Blog Posting Failed',
        }
    }
}

const updateBlog = async (blog) => {
    try {
        const token = JSON.parse(window.localStorage.getItem('token') || '')
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        }
        const id = blog.id
        delete blog.id
        const response = await axios.put(`${baseUrl}/${id}`, blog, config)

        if (response.status === 200) {
            return { ok: true, blog: response.data }
        }

        return {
            ok: false,
            error: response.data.error || 'Blog Updating Failed',
        }
    } catch (error) {
        return {
            ok: false,
            error: error.response?.data.error || 'Blog Updating Failed',
        }
    }
}

const deleteBlog = async (blogId) => {
    try {
        const token = JSON.parse(window.localStorage.getItem('token') || '')
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        }
        const response = await axios.delete(`${baseUrl}/${blogId}`, config)

        if (response.status === 204) {
            return { ok: true }
        }

        return {
            ok: false,
            error: response.data.error || 'Blog Deleting Failed',
        }
    } catch (error) {
        return {
            ok: false,
            error: error.response?.data.error || 'Blog Deleting Failed',
        }
    }
}

const addComment = async (blogId, comment) => {
    try {
        console.log('blogid', blogId)
        console.log('comment', comment)
        const token = JSON.parse(window.localStorage.getItem('token') || '')
        const config = {
            headers: { Authorization: `Bearer ${token}` },
        }
        const response = await axios.put(
            `${baseUrl}/${blogId}/comments`,
            { comment },
            config
        )

        if (response.status === 200) {
            return { ok: true, blog: response.data }
        }
    } catch (error) {
        return {
            ok: false,
            error: error.response?.data.error || 'Blog Deleting Failed',
        }
    }
}

export default { getAll, postBlog, updateBlog, deleteBlog, addComment }
