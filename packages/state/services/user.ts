import { SerializedError } from "@reduxjs/toolkit";
import { BaseQueryError } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootStore } from "packages/state/store";
import { User } from "../domain/user";

interface CustomError {
  status: string;
  data?: {
    statusCode: number;
    message: string;
  };
}

type CustomFetchBaseQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  CustomError,
  {}
>;

export const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootStore).auth;
      if (!accessToken) return headers;

      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
  }) as CustomFetchBaseQuery,
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => ({ url: "/user" }),
    }),

    validateEmail: builder.query<User, string>({
      query: (email) => ({
        url: `/user/${email}`,
      }),
    }),

    updateUser: builder.mutation<User, { id: string; username: string }>({
      query: ({ id, username }) => ({
        url: `/user/${id}`,
        method: "POST",
        body: {
          username,
          isAdmin: true,
        },
      }),
    }),

    updatePassword: builder.mutation<boolean, { current: string; new: string }>(
      {
        query: (passwords) => ({
          url: `/user/change-password`,
          method: "POST",
          body: passwords,
        }),
      }
    ),
  }),
});

export const {
  useGetProfileQuery,
  useValidateEmailQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} = userApi;
