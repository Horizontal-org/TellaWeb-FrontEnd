import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query/react";
import { authApi } from "./services/auth";
import { authSlice } from "./features/auth/authSlice";
import { userApi } from "./services/user";
import { userSlice } from "./features/user/userSlice";
import { reportsSlice } from "./features/reports/reportsSlice";
import { reportsApi } from "./services/reports";
import { filesApi } from "./services/files";
import { configurationApi } from './services/configuration'

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [filesApi.reducerPath]: filesApi.reducer,
    [configurationApi.reducerPath]: configurationApi.reducer,
    auth: authSlice.reducer,
    user: userSlice.reducer,
    reports: reportsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      reportsApi.middleware,
      filesApi.middleware,
      configurationApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
