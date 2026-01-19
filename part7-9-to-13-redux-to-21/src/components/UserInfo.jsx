import { useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { ThumbsUp } from 'lucide-react'

export const UserInfo = () => {
    const id = useParams().id
    const blogs = useSelector((state) => state.blogs)
    const user = useSelector((state) => state.users).find((u) => u.id === id)
    const userBlogs = blogs.filter((b) => b.user?.id === id)
    return (
        <>
            <h1>{user?.username}</h1>
            <h2>Added blogs</h2>
            <ul class="list-group">
                {userBlogs.map((blog) => (
                    <li
                        key={blog.id}
                        class="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                        <div class="d-flex align-items-center">
                            <ThumbsUp size={20} />
                            <text class="ml-1">{blog.likes} likes</text>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}
