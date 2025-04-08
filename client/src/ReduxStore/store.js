// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice";
import conversationReducer from "./conversationSlice";
// Combine all your reducers
const rootReducer = combineReducers({
  auth: userReducer,
  conversation: conversationReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
