import { useSelector, useDispatch } from 'react-redux'
import { addLikeAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
    const filter = useSelector(state => state.filter)
    const anecdotes = useSelector(state =>
        state.anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase())))
        .sort((a, b) => (b.votes - a.votes))
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(addLikeAnecdote(anecdote))
        dispatch(setNotification(`You voted for anecdote '${anecdote.content}'`, 5))
    }

    return (
        <>
            {anecdotes.map(anecdote => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote)}>vote</button>
                    </div>
                </div>
            ))}</>
    )
}

export default AnecdoteList