import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootStore } from "packages/state/store";
import { Credential, User, OtpEnableRes, LoginResponse } from "../domain/user";

export const authApi = createApi({
  reducerPath: "authApi",
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
    enable: builder.mutation<OtpEnableRes, {password: string}>({
      query: (password) => ({
        url: "/auth/otp/enable",
        method: "POST",
        body: password
      })
    }),
    activate: builder.mutation<boolean, {code: string}>({
      query: (code) => ({
        url: "/auth/otp/activate",
        method: "POST",
        body: code
      })
    }),
    disable: builder.mutation<boolean, {code: string, is_otp: boolean}> ({
      query: (code) => ({
        url: "/auth/otp/disable",
        method: "POST",
        body: code
      })
    }),
    recoveryKey: builder.query<[string], void>({
      query: () => ({
        url: '/auth/otp/recovery-key'
      })
    }),
    authRecoveryKey: builder.mutation<LoginResponse, {code: string, userId: string, password: string}>({
      query: (credential) => ({
        url: "auth/otp/recovery-key",
        method: "POST",
        body: credential
      })
    }),
    otpLogin: builder.mutation<LoginResponse, {code: string, userId: string}>({
      query: (credential) => ({
        url: "auth/otp/login",
        method: "POST",
        body: credential
      })
    })
  }),
});

export const { 
  useLoginMutation,
  useEnableMutation,
  useActivateMutation,
  useDisableMutation,
  useRecoveryKeyQuery,
  useAuthRecoveryKeyMutation,
  useOtpLoginMutation 
} = authApi;
