import { useNavigate, Link } from 'react-router-dom'

const UserList = ({ users, blogs }) => {
    const navigate = useNavigate()
    const usersWithBlogCount = users.map((user) => ({
        ...user,
        blogsCreated: blogs.filter((blog) => blog.user.id === user.id).length,
    }))

    return (
        <>
            <h2>User List</h2>
            <table class="table my-3">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Name</th>
                        <th>Blogs</th>
                    </tr>
                </thead>
                <tbody>
                    {usersWithBlogCount.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.username}
                                </Link>
                            </td>

                            <td>{user.name}</td>
                            <td>{user.blogsCreated}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default UserList
