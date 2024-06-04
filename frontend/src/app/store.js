import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import sharedDataReducer from "../features/SharedDataSlice/SharedData";

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, sharedDataReducer);

// Ensure the state is serializable
const store = configureStore({
  reducer: {
    sharedData: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for now
    }),
});

export const persistor = persistStore(store);

export { store }; // Export the store as named export
