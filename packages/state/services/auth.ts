import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Credential } from "@tellaweb/bloc";
import { RootStore } from "packages/state/store";
import { User } from "../domain/user";

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootStore).auth;
      if (!accessToken) return headers;

      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<{ access_token: string; user: User }, Credential>({
      query: (credential) => ({
        url: "/login",
        method: "POST",
        body: credential,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
