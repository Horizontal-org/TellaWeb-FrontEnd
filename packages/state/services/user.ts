import { SerializedError } from "@reduxjs/toolkit";
import { BaseQueryError } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootStore } from "packages/state/store";
import { User, UserQuery } from "../domain/user";
import { Pagination } from "../domain/common";

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

    updateUser: builder.mutation<User, 
    { 
      id: string, 
      username?: string,
      note?: string 
      isAdmin: boolean 
    }>({
      query: ({ id, username = null, note, isAdmin }) => ({
        url: `/${id}`,
        method: "POST",
        body: {
          note: note,
          username: username,
          isAdmin: isAdmin,
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

    list: builder.query<Pagination<User>, UserQuery>({
      query: (userQuery) => {
        const params = {
          limit: userQuery.size,
          offset: userQuery.page * userQuery.size,
          sort: userQuery.sortKey,
          order: userQuery.sortOrder,
          search: userQuery.search,
        };

        return {
          url: "/list",
          params,
        };
      },
    }),

    getByUsername: builder.query<User, string>({
      query: (username) => {
        return {
          url: `/${username}`
        }
      }
    }),

    delete: builder.mutation<boolean, string>({
      query: (userId) => ({
        url: `/${userId}`,
        method: "DELETE",
      }),
    }),

    createUser: builder.mutation<User, { username: string, password: string, isAdmin: boolean }>({
      query: ({ username, password, isAdmin }) => ({
        url: `/`,
        method: "POST",
        body: {
          username,
          password,
          isAdmin: isAdmin,
        },
      }),
    }),

  }),
});

export const {
  useLazyGetProfileQuery,
  useGetProfileQuery,
  useValidateEmailQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useListQuery,
  useLazyGetByUsernameQuery,
  useDeleteMutation,
  useCreateUserMutation
} = userApi;
