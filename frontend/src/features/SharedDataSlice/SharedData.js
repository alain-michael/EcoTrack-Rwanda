import { createSlice } from "@reduxjs/toolkit";

// Default values for shared host
const initialState = {
    usersLogin: [],
};

const sharedDataSlice = createSlice({
    name: 'Eco_rw',
    initialState,
    reducers: {
        addUserLogin: (state, action) => {
            const users = action.payload;
            state.usersLogin = users;
        },
        resetStateToDefault: (state, action) => {
            // Reset state to initial values
            // Object.assign(state, initialState);
            state.usersLogin = []
        }


    }
});

export const { addUserLogin } = sharedDataSlice.actions;

export default sharedDataSlice.reducer;
