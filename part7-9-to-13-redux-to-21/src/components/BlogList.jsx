import { useState } from 'react'
import PostBlogForm from './PostBlogForm'
import { useSelector, useDispatch } from 'react-redux'
import {
    fetchBlogs,
    postBlog,
    likeBlog,
    deleteBlog,
} from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

const BlogList = () => {
    const dispatch = useDispatch()
    const blogs = useSelector((state) => state.blogs)

    const [showAddBlog, setShowAddBlog] = useState(false)

    return (
        <>
            <h2>Blogs List</h2>
            <ul class="list-group my-3">
                {blogs?.map((blog) => (
                    <li key={blog.id} class="list-group-item">
                        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </li>
                ))}
            </ul>
            {showAddBlog ? (
                <div class="form-group">
                    <PostBlogForm
                        onSubmit={(title, author, url) =>
                            dispatch(postBlog(title, author, url))
                        }
                    />
                    <button
                        onClick={() => setShowAddBlog(false)}
                        class="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setShowAddBlog(true)}
                    class="btn btn-primary"
                >
                    Add Blog
                </button>
            )}
        </>
    )
}

export default BlogList
