import { createSlice } from "@reduxjs/toolkit";

// Default values for shared host
const initialState = {
  usersLogin: [],
  selectedItem: "Dashboard",
};

const sharedDataSlice = createSlice({
  name: "Eco_rw",
  initialState,
  reducers: {
    addUserLogin: (state, action) => {
      const users = action.payload;
      state.usersLogin = users;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },

    resetStateToDefault: (state, action) => {
      // Reset state to initial values
      // Object.assign(state, initialState);
      state.usersLogin = [];
      state.selectedItem = "Dashboard";
    },
  },
});

export const { addUserLogin, setSelectedItem } = sharedDataSlice.actions;

export default sharedDataSlice.reducer;
