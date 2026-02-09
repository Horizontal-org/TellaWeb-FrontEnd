import {
  createApi,
} from "@reduxjs/toolkit/query/react";
import baseQueryWithRefresh from "./baseQueryWithRefresh";

import { Pagination } from "../domain/common";
import { Report, ReportQuery } from "../domain/report";
import { addThumbnail } from "../utils/addThumbnail";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  tagTypes: ["Report"],
  baseQuery: baseQueryWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/report`),
  endpoints: (builder) => ({
    getById: builder.query<Report, string>({
      query: (reportId) => ({
        url: `/${reportId}`,
      }),
      transformResponse: addThumbnail,
      providesTags: ({ id }) => [{ id, type: "Report" }],
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
      providesTags: ({ results }) =>
        providesList(
          results.map(({ id }) => ({ id })),
          "Report"
        ),
    }),

    deleteReport: builder.mutation<boolean, string>({
      query: (reportId) => ({
        url: `/${reportId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ id, type: "Report" }],
    }),

    batchDelete: builder.mutation<boolean, string[]>({
      query: (reportIds) => ({
        url: `batch-delete`,
        method: "POST",
        body: {
          toDelete: reportIds,
        },
      }),
      invalidatesTags: (_result, _error, reportIds) =>
        reportIds.map((id) => ({ id, type: "Report" })),
    }),

    editReport: builder.mutation<
      Report,
      { id: string; title: string; description: string }
    >({
      query: ({ id, title, description }) => ({
        url: `/${id}`,
        method: "POST",
        body: {
          title,
          description,
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ id, type: "Report" }],
    }),
  }),
});

function providesList<R extends { id: string | number }[], T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
) {
  return resultsWithIds
    ? [
        { type: tagType, id: "LIST" },
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
      ]
    : [{ type: tagType, id: "LIST" }];
}

export const {
  useLazyGetByIdQuery,
  useGetByIdQuery,
  useListQuery,
  useDeleteReportMutation,
  useBatchDeleteMutation,
  useEditReportMutation,
} = reportsApi;
