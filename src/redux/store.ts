import { configureStore } from '@reduxjs/toolkit'
import snippetReducer from '@/redux/slice/snippetSlice'
import userReducer from '@/redux/slice/userSlice'
import problemReducer from '@/redux/slice/problemSlice'
import submissionReducer from '@/redux/slice/submissionSlice'
export const makeStore = () => {
    return configureStore({
        reducer: {
            snippets: snippetReducer,
            user: userReducer,
            problems: problemReducer,
            submissions: submissionReducer,
        },
    })
}


export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']