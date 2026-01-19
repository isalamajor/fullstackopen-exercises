import Blog from '../src/components/Blog'
import PostBlogForm from '../src/components/PostBlogForm'
import { screen, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { vi, expect } from 'vitest'


test('renders blog with title and author', () => {
    const blog = {
        title: 'TestTitle',
        author: 'TestAuthor',
        likes: 2,
        url: 'TestUrl'
    }

    render(<Blog blog={blog} />)

    const elem = screen.getByText(blog.title)
    expect(elem).toBeDefined()
})


test('shows url and likes when view is clicked', async () => {
    const blog = {
        title: 'TestTitle',
        author: 'TestAuthor',
        likes: 2,
        url: 'TestUrl'
    }

    render(<Blog blog={blog} />)

    const urlBefore = screen.queryByText('TestUrl')
    const likesBefore = screen.queryByText('2 likes')

    const user = userEvent.setup()
    const btnView = screen.getByText('View')
    await user.click(btnView)


    const urlAfter = screen.getByText('TestUrl')
    const likesAfter = screen.getByText('2 likes')

    const elem = screen.getByText(blog.title)
    expect(elem).toBeDefined()
    expect(urlBefore).toBeNull()
    expect(likesBefore).toBeNull()
    expect(urlAfter).toBeDefined()
    expect(likesAfter).toBeDefined()
})

test('llamar onBlogLiked 2 veces si se clica like 2 veces', async () => {
    const blog = {
        title: 'TestTitle',
        author: 'TestAuthor',
        likes: 2,
        url: 'TestUrl'
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} onBlogLiked={mockHandler} />)

    const user = userEvent.setup()
    // Clicar btn View y luego Like 2 veces
    const btnView = screen.getByText('View')
    await user.click(btnView)

    const btnLike = screen.getByText('Like')
    await user.click(btnLike)
    await user.click(btnLike)

    expect(mockHandler.mock.calls).toHaveLength(2)
})


test('llamar submitHandler con los datos correctos', async () => {
    const mockHandler = vi.fn()
    render(<PostBlogForm onSubmit={mockHandler} />)

    const user = userEvent.setup()

    const titleInput = screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('Url')
    const submitBtn = screen.getByText('Post')

    await user.type(titleInput, 'Title Test')
    await user.type(authorInput, 'Author Test')
    await user.type(urlInput, 'Url Test')
    await user.click(submitBtn)

    expect(mockHandler.mock.calls[0][0]).toBe('Title Test')
    expect(mockHandler.mock.calls[0][1]).toBe('Author Test')
    expect(mockHandler.mock.calls[0][2]).toBe('Url Test')
})