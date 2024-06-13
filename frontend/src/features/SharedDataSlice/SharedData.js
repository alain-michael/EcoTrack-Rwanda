import { createSlice } from "@reduxjs/toolkit";

// Default values for shared host
const initialState = {
  usersLogin: [],
  selectedItem: "Dashboard",
  defaultUserType: "Household User",
  currentChat: null,
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
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setdefaultUserType: (state, action) => {
      state.defaultUserType = action.payload;
    },

    resetStateToDefault: (state, action) => {
      // Reset state to initial values
      // Object.assign(state, initialState);
      state.usersLogin = [];
      state.selectedItem = "Dashboard";
      state.defaultUserType = "Household User";
    },
  },
});

export const { addUserLogin, setdefaultUserType, resetStateToDefault, setSelectedItem, setCurrentChat } = sharedDataSlice.actions;

export default sharedDataSlice.reducer;
