import {
  createApi,
} from "@reduxjs/toolkit/query/react";
import baseQueryWithRefresh from "./baseQueryWithRefresh";

import { Pagination } from "../domain/common";
import { Report, ReportQuery } from "../domain/report";
import { addThumbnail } from "../utils/addThumbnail";
import { Resource, ResourceQuery } from "../domain/resource";

export const resourcesApi = createApi({
  reducerPath: "resourcesApi",
  tagTypes: ["Resource"],
  baseQuery: baseQueryWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/resource`),
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
