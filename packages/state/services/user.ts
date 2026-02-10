import {
  createApi,
} from "@reduxjs/toolkit/query/react";
import baseQueryWithRefresh from "./baseQueryWithRefresh";
import { User, UserQuery } from "../domain/user";
import { Pagination } from "../domain/common";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/user`),
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
      password?: string,
      note?: string     
      role: string
    }>({
      query: ({ id, username = null, password = null, note, role }) => ({
        url: `/${id}`,
        method: "POST",
        body: {
          note: note,
          username: username,
          role: role,
          password: password
        },
      }),
    }),

    updateUserSelf: builder.mutation<User, 
    {       
      username: string,
      confirmPassword: string
    }>({
      query: ({ username, confirmPassword }) => ({
        url: `/change-self`,
        method: "POST",
        body: {
          username,
          confirmPassword,
        },
      }),
    }),

    updatePasswordSelf: builder.mutation<boolean, { current: string; new: string }>(
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

    getById: builder.query<User, string>({
      query: (id) => {
        return {
          url: `/${id}`
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
  useUpdateUserSelfMutation,
  useUpdatePasswordSelfMutation,
  useConfirmPasswordMutation,
  useListQuery,
  useGetByIdQuery,
  useDeleteMutation,
  useBatchDeleteUserMutation,
  useCreateUserMutation,
} = userApi;
