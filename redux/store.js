import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "./features/auth/authSlice";
import { expirationMiddleware } from "./middleware/exirationMiddleware";

const persistConfig = {
  key: "root",
  storage,
  expires: 24 * 60 * 60 * 1000, // 24 hours
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).prepend(expirationMiddleware.middleware),
});

export const persistor = persistStore(store);
