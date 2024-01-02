import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { RootStore } from "../../state/store";
import { Pagination } from "../domain/common";
import { Report, ReportQuery } from "../domain/report";
import { addThumbnail } from "../utils/addThumbnail";
import { Resource, ResourceQuery } from "../domain/resource";

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

export const resourcesApi = createApi({
  reducerPath: "resourcesApi",
  tagTypes: ["Resource"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/resource`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootStore).auth;
      if (!accessToken) return headers;

      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
  }) as CustomFetchBaseQuery,
  endpoints: (builder) => ({
  
    list: builder.query<Pagination<Resource>, ResourceQuery>({
      query: (resourceQuery) => {
        const params = {
          limit: resourceQuery.size,
          offset: resourceQuery.page * resourceQuery.size,
          sort: resourceQuery.sortKey,
          order: resourceQuery.sortOrder,
          search: resourceQuery.search,
          exclude: resourceQuery.exclude
        };

        return {
          url: "/",
          params,
        };
      },
    }),

    deleteResource: builder.mutation<boolean, string>({
      query: (resourceId) => ({
        url: `/${resourceId}`,
        method: "DELETE",
      }),
    }),

  }),
});


export const {
  useListQuery,
  useDeleteResourceMutation,
} = resourcesApi;
