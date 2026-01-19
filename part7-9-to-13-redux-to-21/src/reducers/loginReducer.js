import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/user'
import { setNotification } from './notificationReducer'

const initialState = {
    username: '',
    token: '',
}
const loginSlice = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
        clearUser(state, action) {
            return initialState
        },
    },
})

const { setUser, clearUser } = loginSlice.actions

export const login = (username, password) => {
    return async (dispatch) => {
        const res = await loginService.login(username, password)
        if (res.ok && res.token) {
            dispatch(
                setUser({
                    username: username,
                    token: res.token,
                })
            )
        } else {
            dispatch(setNotification(res.error))
        }
    }
}

export const logout = () => {
    return async (dispatch) => {
        dispatch(clearUser())
        window.localStorage.clear()
    }
}
export default loginSlice.reducer
