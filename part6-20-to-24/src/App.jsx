import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAnecdotes, likeAnecdote } from './services/anecdoteApi'
import NotificationContext from './context/NotificationContext'
import { useContext } from 'react'

const App = () => {
  const client = useQueryClient()
  const { setNotification } = useContext(NotificationContext)

  const voteAnecdote = useMutation({
    mutationFn: async (anecdote) => {
      await likeAnecdote(anecdote);
      setNotification(`You voted anecdote '${anecdote.content}'`);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['anecdotes'] }) // query will be reexecuted
    }
  })

  const result = useQuery(
    {
      queryKey: ['anecdotes'],
      queryFn: getAnecdotes,
      retry: 1
    }
  )

  if (result.isLoading) {
    return (
      <p>Loading...</p>
    )
  }
  if (result.error) {
    return (
      <p>Error fetching data</p>
    )
  }

  const anecdotes = result.data || []

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteAnecdote.mutate(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
