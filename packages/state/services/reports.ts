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

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/report`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootStore).auth;
      if (!accessToken) return headers;

      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
  }) as CustomFetchBaseQuery,
  endpoints: (builder) => ({
    getById: builder.query<Report, string>({
      query: (reportId) => ({
        url: `/${reportId}`,
      }),
      transformResponse: addThumbnail,
    }),

    list: builder.query<Pagination<Report>, ReportQuery>({
      query: (reportQuery) => {
        const params = {
          limit: reportQuery.size,
          offset: reportQuery.page * reportQuery.size,
          sort: reportQuery.sortKey,
          order: reportQuery.sortOrder,
          search: reportQuery.search,
        };

        return {
          url: "/",
          params,
        };
      },
      transformResponse: (response: Pagination<Report>) => ({
        ...response,
        results: response.results.map(addThumbnail),
      }),
    }),

    deleteReport: builder.mutation<boolean, string>({
      query: (reportId) => ({
        url: `/${reportId}`,
        method: "DELETE",
      }),
    }),

    batchDelete: builder.mutation<boolean, string[]>({
      query: (reportIds) => ({
        url: `batch-delete`,
        method: "POST",
        body: reportIds,
      }),
    }),

    editReport: builder.mutation<Report, {id, title, description}>({
      query: ({id, title, description}) => ({
        url: `/${id}`,
        method: 'POST',
        body: {
          title,
          description
        }
      })
    })
  }),
});

export const {
  useLazyGetByIdQuery,
  useListQuery,
  useDeleteReportMutation,
  useBatchDeleteMutation,
  useEditReportMutation
} = reportsApi;
