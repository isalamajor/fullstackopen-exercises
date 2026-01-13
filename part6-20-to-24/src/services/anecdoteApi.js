const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch anecdotes')
    }

    return await response.json()
}

export const createNew = async (anecdote) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: anecdote,
            votes: 0
        })
    })

    if (!response.ok) {
        throw new Error('Failed to add anecdote')
    }

    return await response.json()
}

export const likeAnecdote = async (anecdote) => {
    if (!anecdote || !anecdote.id || !anecdote.content || anecdote.votes === undefined) {
        throw new Error('Failed to like anecdote. Missing fields.')
    }
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: anecdote.content,
            votes: anecdote.votes + 1
        })
    })
    if (!response.ok) {
        throw new Error('Failed to like anecdote')
    }
}

export default { getAnecdotes, createNew, likeAnecdote }