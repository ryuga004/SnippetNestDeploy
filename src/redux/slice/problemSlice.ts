
import { removeTypename } from '@/lib';
import { CodingProblemType } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


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
});


export const { setproblems, addProblem, removeProblem, updateProblem, setLoadingProblem, setErrorProblem } = problemSlice.actions;

export default problemSlice.reducer;
