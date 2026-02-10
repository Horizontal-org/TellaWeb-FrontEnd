import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithRefresh from "./baseQueryWithRefresh";
import { Credential, User, OtpEnableRes, LoginResponse } from "../domain/user";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefresh(process.env.NEXT_PUBLIC_API_URL),
  endpoints: (builder) => ({
    login: builder.mutation<{ access_token: string; user: User, flagged?: boolean }, Credential>({
      query: (credential) => ({
        url: "/login/web",
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
    disable: builder.mutation<boolean, {code: string, is_otp: boolean, confirm_password: string}> ({
      query: (body) => ({
        url: "/auth/otp/disable",
        method: "POST",
        body: body
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
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { 
  useLoginMutation,
  useEnableMutation,
  useActivateMutation,
  useDisableMutation,
  useRecoveryKeyQuery,
  useAuthRecoveryKeyMutation,
  useOtpLoginMutation,
  useLogoutMutation,
} = authApi;
