import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import {
    likeBlog,
    deleteBlog,
    addCommentBlog,
    fetchBlogs,
} from '../reducers/blogReducer'
import { useState, useEffect } from 'react'
import { ThumbsUp } from 'lucide-react'

const Blog = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const username = JSON.parse(localStorage.getItem('username') || '')
    const id = useParams().id
    const [comment, setComment] = useState('')

    const blogs = useSelector((state) => state.blogs)

    useEffect(() => {
        if (!blogs.length) {
            dispatch(fetchBlogs())
        }
    }, [blogs.length, dispatch])

    const blog = blogs.find((b) => b.id === id)

    if (!blog) {
        return <div>loading...</div>
    }

    return (
        <div>
            <h1>{blog.title}</h1>
            <div class="mb-5">
                <div class="m-1">
                    <label class="mr-2 font-weight-bold">Author:</label>
                    {blog.author}
                </div>

                <label class="mr-2 font-weight-bold">Link to blog:</label>
                <a href={blog.url} target="_blank">
                    {blog.url}
                </a>
                <div class="m-1">
                    <label class="mr-2 font-weight-bold">Posted by:</label>
                    {blog.user?.username}
                </div>
                <div class="m-1">
                    {blog.likes} likes
                    <button
                        onClick={() => dispatch(likeBlog(blog))}
                        class="btn btn-secondary ml-2"
                    >
                        <div class="d-flex align-items-center">
                            <ThumbsUp size={20} />
                            <text class="ml-1">Like</text>
                        </div>
                    </button>
                </div>
                {username === blog.user?.username && (
                    <button
                        onClick={() => {
                            dispatch(deleteBlog(blog.id))
                            navigate('/')
                        }}
                        class="btn btn-danger"
                    >
                        Delete blog
                    </button>
                )}
            </div>
            <h2>Comments</h2>
            <ul>
                {blog.comments?.map((com, i) => (
                    <li key={com + i}>{com}</li>
                ))}
            </ul>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    dispatch(addCommentBlog(blog.id, comment))
                    setComment('')
                }}
                class="form-inline"
            >
                <input
                    type="text"
                    value={comment}
                    name="Comment"
                    placeholder="Add a new comment"
                    onChange={({ target }) => {
                        setComment(target.value)
                    }}
                    class="form-control"
                />
                <button type="submit" class="btn btn-primary ml-1">
                    Post
                </button>
            </form>
        </div>
    )
}

export default Blog
