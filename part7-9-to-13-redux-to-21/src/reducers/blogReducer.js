import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        addBlog(state, action) {
            state.push(action.payload)
        },
        updateBlog(state, action) {
            return state.map((b) =>
                b.id === action.payload.id ? action.payload : b
            )
        },
        removeBlog(state, action) {
            return state.filter((b) => b.id !== action.payload)
        },
    },
})

const { setBlogs, addBlog, updateBlog, removeBlog } = blogSlice.actions

export const fetchBlogs = () => {
    return async (dispatch) => {
        const res = await blogService.getAll()
        if (res.ok) {
            dispatch(setBlogs(res.blogs.sort((a, b) => b.likes - a.likes)))
        } else dispatch(setNotification(res.error))
    }
}

export const postBlog = (title, author, url) => {
    return async (dispatch) => {
        if (title && author && url) {
            const res = await blogService.postBlog({ title, author, url })
            if (res.ok && res.blog) {
                dispatch(addBlog(res.blog))
                dispatch(setNotification(`New blog '${title}' was added`))
            } else {
                dispatch(setNotification(res.error))
            }
        }
    }
}

export const likeBlog = (blog) => {
    return async (dispatch) => {
        const res = await blogService.updateBlog({
            ...blog,
            likes: blog.likes + 1,
        })
        if (res.ok) {
            dispatch(updateBlog(res.blog))
        } else {
            dispatch(setNotification(res.error))
        }
    }
}

export const deleteBlog = (blogId) => {
    return async (dispatch) => {
        const res = await blogService.deleteBlog(blogId)
        if (res.ok) {
            dispatch(removeBlog(blogId))
            dispatch(setNotification('Blog deleted'))
        }
    }
}

export const addCommentBlog = (blogId, comment) => {
    return async (dispatch) => {
        if (blogId && comment) {
            const res = await blogService.addComment(blogId, comment)
            if (res.ok && res.blog) {
                dispatch(updateBlog(res.blog))
                dispatch(
                    setNotification('Your comment was posted successfully')
                )
            } else {
                dispatch(setNotification(res.error))
            }
        }
    }
}

export default blogSlice.reducer
