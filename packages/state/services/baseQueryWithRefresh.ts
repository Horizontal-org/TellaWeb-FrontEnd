import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { setCredentials, clearCredentials } from "../features/auth/authSlice";
import { RootStore } from "../store";

let refreshPromise: Promise<boolean> | null = null;

const baseQuery = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootStore).auth;
      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }
      return headers;
    },
  });

const baseQueryWithRefresh =
  (baseUrl: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =>
  async (args, api, extraOptions) => {
    let result = await baseQuery(baseUrl)(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const { refreshToken } = (api.getState() as RootStore).auth;
          if (!refreshToken) return false;

          const refreshResult = await baseQuery(process.env.NEXT_PUBLIC_API_URL)(
            {
              url: "/auth/refresh",
              method: "POST",
              body: { refresh_token: refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            api.dispatch(setCredentials(refreshResult.data as { access_token: string; refresh_token: string }));
            return true;
          }

          api.dispatch(clearCredentials());
          return false;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const refreshed = await refreshPromise;
      if (refreshed) {
        result = await baseQuery(baseUrl)(args, api, extraOptions);
      }
    }

    return result;
  };

export default baseQueryWithRefresh;
