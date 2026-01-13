import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from "../reducers/notificationReducer"
import anecdoteService from '../services/anecdoteApi'

const AnecdoteForm = () => {

    const dispatch = useDispatch()

    const submitForm = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        dispatch(appendAnecdote(content))
        dispatch(setNotification(`You added anecdote '${content}'`, 5))
        event.target.anecdote.value = ''
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={submitForm}>
                <div>
                    <input name='anecdote' />
                </div>
                <button>create</button>
            </form>
        </>
    )
}

export default AnecdoteForm