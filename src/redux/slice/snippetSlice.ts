import { removeTypename } from '@/lib';
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
});


export const { setSnippets, addSnippet, removeSnippet, editSnippet, setLoading, setError } = snippetSlice.actions;

export default snippetSlice.reducer;
