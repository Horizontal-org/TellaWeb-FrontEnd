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
      role: string
    }>({
      query: ({ id, username = null, note, role }) => ({
        url: `/${id}`,
        method: "POST",
        body: {
          note: note,
          username: username,
          role: role
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
    confirmPassword: builder.mutation<boolean, { current: string}> ({
      query: (currentPassword) => ({
        url: "/confirm/password",
        method: "POST",
        body: currentPassword
      })
    }),
    list: builder.query<Pagination<User>, UserQuery>({
      query: (userQuery) => {
        const params = {
          limit: userQuery.size,
          offset: userQuery.page * userQuery.size,
          sort: userQuery.sortKey,
          order: userQuery.sortOrder,
          search: userQuery.search,
          exclude: userQuery.exclude
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

    batchDeleteUser: builder.mutation<boolean, string[]>({
      query: (userIds) => ({
        url: `/batch-delete`,
        method: "POST",
        body: {
          toDelete: userIds,
        }
      }),
    }),

    createUser: builder.mutation<User, { username: string, password: string, role: string }>({
      query: ({ username, password, role }) => ({
        url: `/`,
        method: "POST",
        body: {
          username,
          password,
          role
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
  useConfirmPasswordMutation,
  useListQuery,
  useLazyGetByUsernameQuery,
  useDeleteMutation,
  useBatchDeleteUserMutation,
  useCreateUserMutation,
} = userApi;
