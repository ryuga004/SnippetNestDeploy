
import { removeTypename } from '@/lib';
import client from '@/lib/ApolloClient';
import { GET_ALL_PROGLEM } from '@/lib/services';
import { CodingProblemType } from '@/lib/types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


interface problemstate {
    problems: CodingProblemType[];
    loading: boolean;
    error: string | null;
}
const initialState: problemstate = {
    problems: [],
    loading: false,
    error: null,
};

export const fetchProblems = createAsyncThunk(
    "problems/fetchProblems",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await client.query({
                query: GET_ALL_PROGLEM,
                fetchPolicy: "no-cache",
            });
            if (!data.getAllCodingProblems.success) {
                return rejectWithValue(data.getAllCodingProblems.message || "Failed to fetch problems");
            }
            return data.getAllCodingProblems.problems;
        } catch (error) {
            console.error("Error fetching problems:", error);
            return rejectWithValue("Error fetching problems");
        }
    }
);
const problemSlice = createSlice({
    name: 'problem',
    initialState,
    reducers: {
        setproblems: (state, action: PayloadAction<CodingProblemType[]>) => {

            state.problems = action.payload.map(removeTypename);
        },
        addProblem: (state, action: PayloadAction<CodingProblemType>) => {
            state.problems.push(action.payload);
        },
        removeProblem: (state, action: PayloadAction<string>) => {
            state.problems = state.problems.filter(problem => problem.id !== action.payload);
        },
        updateProblem: (state, action: PayloadAction<CodingProblemType>) => {
            const index = state.problems.findIndex(item => item.id === action.payload.id);
            if (index !== -1) {
                state.problems[index] = action.payload;
            }
        },
        setLoadingProblem: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setErrorProblem: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProblems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProblems.fulfilled, (state, action) => {
                state.loading = false;
                state.problems = action.payload.map(removeTypename);
            })
            .addCase(fetchProblems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});


export const { setproblems, addProblem, removeProblem, updateProblem, setLoadingProblem, setErrorProblem } = problemSlice.actions;

export default problemSlice.reducer;
