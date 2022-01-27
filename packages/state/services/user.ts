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
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/user`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootStore).auth;
      if (!accessToken) return headers;

      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
  }) as CustomFetchBaseQuery,
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => ({ url: "/" }),
    }),

    validateEmail: builder.query<User, string>({
      query: (email) => ({
        url: `/${email}`,
      }),
    }),

    updateUser: builder.mutation<User, { id: string; username: string }>({
      query: ({ id, username }) => ({
        url: `/${id}`,
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
          url: `/change-password`,
          method: "POST",
          body: passwords,
        }),
      }
    ),
  }),
});

export const {
  useLazyGetProfileQuery,
  useGetProfileQuery,
  useValidateEmailQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} = userApi;
