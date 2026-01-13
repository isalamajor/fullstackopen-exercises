import { createContext, useReducer } from "react"

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return action.payload
        case 'CLEAR':
            return ''
        default:
            return ''
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, notificationDispatch] = useReducer(notificationReducer, '')
    const setNotification = (text) => {
        notificationDispatch({
            type: 'SET',
            payload: text
        })
        setTimeout(() => {
            notificationDispatch({ type: 'CLEAR' })
        }, 5000) // 5 seconds
    }
    return (
        <NotificationContext.Provider value={{ notification, setNotification }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext