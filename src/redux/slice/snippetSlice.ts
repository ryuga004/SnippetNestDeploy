import { removeTypename } from '@/lib';
import client from '@/lib/ApolloClient';
import { GET_ALL_SNIPPETS_ADMIN } from '@/lib/services';
import { Snippet } from '@/lib/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


interface SnippetState {
    snippets: Snippet[];
    loading: boolean;
    error: string | null;
}

const initialState: SnippetState = {
    snippets: [],
    loading: false,
    error: null,
};

export const fetchSnippets = createAsyncThunk(
    "snippets/fetchSnippets",
    async (_, { rejectWithValue }) => {
        try {
            console.log("Fetching snippets...");

            const { data } = await client.query({
                query: GET_ALL_SNIPPETS_ADMIN,
                fetchPolicy: "no-cache",
            });

            console.log("Response Data:", data);

            if (!data.getAllSnippets.success) {
                return rejectWithValue(data.getAllSnippets.message || "Failed to fetch snippets");
            }

            return data.getAllSnippets.snippets;
        } catch (error) {
            console.error("Error fetching snippets:", error);
            return rejectWithValue("Error fetching snippets");
        }
    }
);

const snippetSlice = createSlice({
    name: 'snippet',
    initialState,
    reducers: {
        setSnippets: (state, action: PayloadAction<Snippet[]>) => {
            state.snippets = action.payload.map(removeTypename);
        },
        addSnippet: (state, action: PayloadAction<Snippet>) => {
            state.snippets.push(action.payload);
        },
        removeSnippet: (state, action: PayloadAction<string>) => {
            state.snippets = state.snippets.filter(snippet => snippet.id !== action.payload);
        },
        editSnippet: (state, action: PayloadAction<Partial<Snippet>>) => {
            const index = state.snippets.findIndex(snippet => snippet.id === action.payload?.id);
            if (index !== -1) {
                state.snippets[index] = {
                    ...state.snippets[index],
                    ...action.payload
                };
            } else {
                console.warn(`Snippet with ID ${action.payload?.id} not found.`);
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSnippets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSnippets.fulfilled, (state, action) => {
                state.loading = false;
                console.log("SDLFNOSNGS", action.payload);
                state.snippets = action.payload.map(removeTypename);
            })
            .addCase(fetchSnippets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { setSnippets, addSnippet, removeSnippet, editSnippet, setLoading, setError } = snippetSlice.actions;

export default snippetSlice.reducer;
