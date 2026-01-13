import { createSlice } from "@reduxjs/toolkit"

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
        }
    }
})

const { changeNotification, clearNotification } = notificationSlice.actions

export const setNotification = (text, timeout) => {
    return (dispatch) => {
        dispatch(changeNotification(text))
        setTimeout(() => {
            dispatch(clearNotification())
        }, timeout * 1000) // timeout is given in seconds
    }
}
export default notificationSlice.reducer