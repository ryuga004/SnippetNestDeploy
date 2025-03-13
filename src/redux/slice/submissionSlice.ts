

import { removeTypename } from '@/lib';
import { Submission } from '@/lib/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Submissionstate {
    submissions: Submission[];
    loading: boolean;
    error: string | null;
}

const initialState: Submissionstate = {
    submissions: [],
    loading: false,
    error: null,
};

const submissionSlice = createSlice({
    name: 'submission',
    initialState,
    reducers: {
        setSubmissions: (state, action: PayloadAction<Submission[]>) => {
            state.submissions = action.payload.map(removeTypename);
        },
        addSubmission: (state, action: PayloadAction<Submission>) => {
            state.submissions.push(
                action.payload
            );
        },
        setLoadingSubmission: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setErrorSubmission: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});


export const { setSubmissions, addSubmission, setLoadingSubmission, setErrorSubmission } = submissionSlice.actions;

export default submissionSlice.reducer;
