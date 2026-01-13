import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteApi'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: initialState,
  reducers: {
    voteAnecdote(state, action) {
      return state.map(a => {
        if (a.id === action.payload) {
          return { ...a, votes: a.votes + 1 }
        }
        return a
      })
    },
    createAnecdote(state, action) {
      state.push(action.payload) // con redux toolkit se puede hacer push
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

const { setAnecdotes, createAnecdote, voteAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const addLikeAnecdote = (anecdote) => {
  return async (dispatch) => {
    await anecdoteService.likeAnecdote(anecdote)
    dispatch(voteAnecdote(anecdote.id))
  }
}


export default anecdoteSlice.reducer



/*const getId = () => (100000 * Math.random()).toFixed(0)
const asObject = anecdote => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}
const initialState = anecdotesAtStart.map(asObject)

const anecdoteReducer = (state = initialState, action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'VOTE':
      return state.map(a => {
        if (a.id === action.payload) {
          return { ...a, votes: a.votes + 1 }
        }
        return a
      })
    case 'NEW':
      return [...state, {
        content: action.payload,
        id: getId(),
        votes: 0
      }]
    default:
      return state
  }
}

export const toggleVotesOf = (id) => {
  return {
    type: 'VOTE',
    payload: id
  }
}

export const addAnecdote = (content) => {
  if (!content || content.trim() === '') return
  return {
    type: 'NEW',
    payload: content
  }
}

export default anecdoteReducer*/
