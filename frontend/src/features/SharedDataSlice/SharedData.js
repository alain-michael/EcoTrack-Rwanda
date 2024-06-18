import { createSlice } from '@reduxjs/toolkit';

// Default values for shared host
const initialState = {
  usersLogin: [],
  selectedItem: "Dashboard",
  defaultUserType: "Household User",
  currentChat: null,
  notificationOpen: false,
};

const sharedDataSlice = createSlice({
  name: 'Eco_rw',
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
    setAllCollectionsData: (state, action) => {
      // Set table data
      state.allCollectionsData = action.payload;
    },
    setMyCollectionsData: (state, action) => {
      // Set table data
      state.myCollectionsData = action.payload;
    },
    updateTable: (state, action) => {
      const id = action.payload;
      const removedRequest = state.allCollectionsData.find(
        (request) => request.id === id,
      );
      state.allCollectionsData = state.allCollectionsData.filter(
        (request) => request.id !== id,
      );
      // add removed request to my collections at the top
      state.myCollectionsData.unshift(removedRequest);
      console.log(state.myCollectionsData);
    },
    setdefaultUserType: (state, action) => {
      state.defaultUserType = action.payload;
    },

    setNotificationOpen: (state, action) => {
      state.notificationOpen = action.payload;
    },

    resetStateToDefault: (state, action) => {
      // Reset state to initial values
      // Object.assign(state, initialState);
      state.usersLogin = [];
      state.selectedItem = 'Dashboard';
      state.defaultUserType = 'Household User';
    },
  },
});

export const {
  addUserLogin,
  setdefaultUserType,
  resetStateToDefault,
  setSelectedItem,
  setAllCollectionsData,
  updateTable,
  setMyCollectionsData,
  setCurrentChat,
  setNotificationOpen,
} = sharedDataSlice.actions;

export default sharedDataSlice.reducer;
