import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        changeNotification(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return initialState
        },
    },
})

const { changeNotification, clearNotification } = notificationSlice.actions

export const setNotification = (text) => {
    return (dispatch) => {
        dispatch(changeNotification(text))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000) // 5 seconds
    }
}
export default notificationSlice.reducer
