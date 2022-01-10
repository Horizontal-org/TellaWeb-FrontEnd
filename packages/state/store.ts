import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query/react";
import { authApi } from "./services/auth";
import { authSlice } from "./features/auth/authSlice";
import { authLocalStorageMiddleware } from "./features/auth/authLocalStorageMiddleware";
import { userApi } from "./services/user";
import { userSlice } from "./features/user/userSlice";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    auth: authSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    authLocalStorageMiddleware,
  ],
});

setupListeners(store.dispatch);

export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
