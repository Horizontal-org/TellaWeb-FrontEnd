import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootStore } from "packages/state/store";
import { Project, ProjectQuery } from "../domain/project";
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

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/project`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootStore).auth;
      if (!accessToken) return headers;

      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
  }) as CustomFetchBaseQuery,
  endpoints: (builder) => ({
    list: builder.query<Pagination<Project>, ProjectQuery>({
      query: (projectQuery) => {
        const params = {
          limit: projectQuery.size,
          offset: projectQuery.page * projectQuery.size,
          sort: projectQuery.sortKey,
          order: projectQuery.sortOrder,
          search: projectQuery.search,
        };

        return {
          url: "/",
          params,
        };
      },
    }),

    createProject: builder.mutation<Project, { 
      name: string,      
    }>({
      query: ({ name }) => ({
        url: `/`,
        method: "POST",
        body: {
          name,         
        },
      }),
    }),

    getById: builder.query<Project, string>({
      query: (projectId) => ({
        url: `/${projectId}`,
      }),
    }),

    editProject: builder.mutation<
      Project,
      { id: string; name?: string; url?: string; slug?: string }
    >({
      query: (toEdit) => ({
        url: `/${toEdit.id}`,
        method: "PUT",
        body: toEdit,
      }),
    }),

    addUsers: builder.mutation<
      Project,
      { id: string; users: string[]; }
    >({
      query: ({ id, users }) => ({
        url: `/${id}`,
        method: "PUT",
        body: {
          users,
        },
      }),
    }),

    deleteProject: builder.mutation<
      Project,
      { id: string; }
    >({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),

  }),
});

export const {
  useListQuery,
  useCreateProjectMutation,
  useGetByIdQuery,
  useEditProjectMutation,
  useAddUsersMutation,
  useDeleteProjectMutation
} = projectApi;
