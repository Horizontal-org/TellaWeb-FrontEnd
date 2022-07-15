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

  }),
});

export const {
  useListQuery,
} = projectApi;
