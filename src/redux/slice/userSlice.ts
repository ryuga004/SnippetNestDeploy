
import { User } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface UserState {
    user: User,
    loading: boolean;
    error: string | null;
    isLoggedIn: boolean,
    isAdmin: boolean,
}
const initialState: UserState = {
    user: {
        id: "",
        username: "",
        email: "",
        avatar: "/user_logo.png"
    },
    loading: false,
    error: null,
    isLoggedIn: false,
    isAdmin: false,
};



const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{
            user: User,
            isAdmin: boolean,
        }>) => {
            state.user = action.payload.user;
            state.isLoggedIn = state.user.id !== "";
            state.isAdmin = action.payload.isAdmin;
        },
        removeUser: (state) => {
            state.user = initialState.user;
            state.isLoggedIn = false;
            state.isAdmin = false;
        },
        setLoadingUser: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setErrorUser: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});


export const { setUser, removeUser, setLoadingUser, setErrorUser } = userSlice.actions;

export default userSlice.reducer;
