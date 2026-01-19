import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

const PostBlogForm = ({ onSubmit }) => {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handlePost = async (event) => {
        event.preventDefault()
        onSubmit(title, author, url)
        setTitle('')
        setAuthor('')
        setUrl('')
    }
    return (
        <>
            <h2>Add a blog</h2>
            <form onSubmit={handlePost}>
                <div class="form-group">
                    <div>
                        <label for="Title">Title</label>
                        <input
                            type="text"
                            value={title}
                            name="Title"
                            placeholder="Title"
                            onChange={({ target }) => setTitle(target.value)}
                            class="form-control"
                        />
                    </div>
                    <div>
                        <label for="Author">Author</label>
                        <input
                            type="text"
                            value={author}
                            name="Author"
                            placeholder="Author"
                            onChange={({ target }) => setAuthor(target.value)}
                            class="form-control"
                        />
                    </div>
                    <div>
                        <label for="Url">Url</label>
                        <input
                            type="text"
                            value={url}
                            name="Url"
                            placeholder="Url"
                            onChange={({ target }) => setUrl(target.value)}
                            class="form-control"
                        />
                    </div>
                    <button type="submit" class="btn btn-success">
                        Post
                    </button>
                </div>
            </form>
        </>
    )
}

export default PostBlogForm
