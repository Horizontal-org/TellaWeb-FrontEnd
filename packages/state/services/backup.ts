import {
    BaseQueryFn,
    createApi,
    FetchArgs,
    fetchBaseQuery,
  } from "@reduxjs/toolkit/query/react";
  
  import { RootStore } from "../../state/store";
  import { Pagination } from "../domain/common";
  import { Backup, LatestBackups } from "../domain/backup";
  
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
  
  export const backupsApi = createApi({
    reducerPath: "backupsApi",
    tagTypes: ["Backup"],
    baseQuery: fetchBaseQuery({
      baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/backup`,
      prepareHeaders: (headers, { getState }) => {
        const { accessToken } = (getState() as RootStore).auth;
        if (!accessToken) return headers;
  
        headers.set("authorization", `Bearer ${accessToken}`);
        return headers;
      },
    }) as CustomFetchBaseQuery,
    endpoints: (builder) => ({
    
      latest: builder.query<LatestBackups, void>({
        query: () => {        
          return {
            url: "/latest",
          };
        },
      }),
  
      start: builder.mutation<boolean, void>({
        query: () => ({
          url: "/",
          method: "POST",          
        })
      }),
  
      delete: builder.mutation<boolean, string>({
        query: (id: string) => ({
          url: `/delete/${id}`,
          method: "DELETE",          
        })
      }),

    }),
  });
  
  
  export const {
    useLatestQuery,
    useStartMutation,
    useDeleteMutation
    // useDeleteResourceMutation,
  } = backupsApi;
  