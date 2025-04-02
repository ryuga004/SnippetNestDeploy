
import client from '@/lib/ApolloClient';
import { GET_ME } from '@/lib/services';
import { User } from '@/lib/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


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

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await client.query({
                query: GET_ME,
                fetchPolicy: "no-cache",
            });
            if (!data.GetMe.success) {
                return rejectWithValue(data.GetMe.message || "Failed to fetch user");
            }
            return data.GetMe.user;
        } catch(error) {
            console.log("Error fetching user:",error);
            return rejectWithValue("Error fetching user");
        }
    }
)

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
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = {
                id: action.payload.id,
                username: action.payload.username,
                email: action.payload.email,
                avatar: action.payload?.avatar || "/user_logo.png",
              };
            state.isAdmin = action.payload?.role === "ADMIN";
            state.error = null;
            state.isLoggedIn = true;
        });
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },

});


export const { setUser, removeUser, setLoadingUser, setErrorUser } = userSlice.actions;

export default userSlice.reducer;
