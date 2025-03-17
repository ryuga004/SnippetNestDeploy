import problemReducer from '@/redux/slice/problemSlice'
import snippetReducer from '@/redux/slice/snippetSlice'
import submissionReducer from '@/redux/slice/submissionSlice'
import userReducer from '@/redux/slice/userSlice'
import { configureStore } from '@reduxjs/toolkit'
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