import filterReducer from "./filterReducer";
import anecdoteReducer from "./anecdoteReducer";
import notificationReducer from './notificationReducer'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
    reducer: {
        anecdotes: anecdoteReducer,
        filter: filterReducer,
        notification: notificationReducer
    }
})

export default store