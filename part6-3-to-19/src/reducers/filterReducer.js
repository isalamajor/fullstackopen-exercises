import { createSlice } from "@reduxjs/toolkit"
const initialState = ''

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
        changeFilter(state, action) {
            return action.payload
        }
    }
})

export const { changeFilter } = filterSlice.actions
export default filterSlice.reducer

/*const filterReducer = (state = initialState, action) => {
    console.log('state now: ', state)
    console.log('action', action)
    switch (action.type) {
        case 'CHANGE':
            return action.payload
        default:
            return state
    }
}

export const changeFilter = (filter) => {
    return {
        type: 'CHANGE',
        payload: filter || ''
    }
}

export default filterReducer*/
