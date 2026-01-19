import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/user'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
    name: 'users',
    initialState: [],
    reducers: {
        setUsers(state, action) {
            return action.payload
        },
    },
})

const { setUsers } = userSlice.actions

export const fetchUsers = () => {
    return async (dispatch) => {
        const res = await userService.getAll()
        if (res.ok) {
            dispatch(setUsers(res.users))
        } else dispatch(setNotification(res.error))
    }
}

export default userSlice.reducer
