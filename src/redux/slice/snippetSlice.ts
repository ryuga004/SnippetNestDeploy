import { snippets } from '@/lib/data';
import { Snippet } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


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


const snippetSlice = createSlice({
    name: 'snippet',
    initialState,
    reducers: {
        setSnippets: (state) => {
            state.snippets = snippets;
        },
        addSnippet: (state, action: PayloadAction<Snippet>) => {
            state.snippets.push(action.payload);
        },
        removeSnippet: (state, action: PayloadAction<string>) => {
            state.snippets = state.snippets.filter(snippet => snippet.id !== action.payload);
        },
        updateSnippet: (state, action: PayloadAction<Snippet>) => {
            const index = state.snippets.findIndex(snippet => snippet.id === action.payload.id);
            if (index !== -1) {
                state.snippets[index] = action.payload;
            }
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});


export const { setSnippets, addSnippet, removeSnippet, updateSnippet, setLoading, setError } = snippetSlice.actions;

export default snippetSlice.reducer;
