import { useState } from "react"

const PostBlogForm = ({ onSubmit }) => {
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
                <div>
                    title
                    <input
                        type="text"
                        value={title}
                        name="Title"
                        placeholder="Title"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        type="text"
                        value={author}
                        name="Author"
                        placeholder="Author"
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    url
                    <input
                        type="text"
                        value={url}
                        name="Url"
                        placeholder="Url"
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit">Post</button>
            </form>
        </>
    )
}


export default PostBlogForm