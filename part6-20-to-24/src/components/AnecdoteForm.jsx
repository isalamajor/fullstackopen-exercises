import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNew } from "../services/anecdoteApi"
import { useContext } from "react"
import NotificationContext from "../context/NotificationContext"

const AnecdoteForm = () => {
  const client = useQueryClient()
  const { setNotification } = useContext(NotificationContext)
  const createAnecdote = useMutation({
    mutationFn: async (content) => {
      await createNew(content);
      setNotification(`You added a new anecdote: '${content}'`);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['anecdotes'] }) // query will be reexecuted
    },
    onError: () => {
      setNotification('Anecdote must be at elast 5 characters long')
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    createAnecdote.mutate(content)
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
