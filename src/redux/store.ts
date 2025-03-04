import { configureStore } from '@reduxjs/toolkit'
import snippetReducer from '@/redux/slice/snippetSlice'
import userReducer from '@/redux/slice/userSlice'
export const makeStore = () => {
    return configureStore({
        reducer: {
            snippets: snippetReducer,
            user: userReducer,
        },
    })
}


export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']