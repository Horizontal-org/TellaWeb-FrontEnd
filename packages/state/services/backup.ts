import {
    createApi,
  } from "@reduxjs/toolkit/query/react";
  import baseQueryWithRefresh from "./baseQueryWithRefresh";
  
  import { Backup, BackupSpace, LatestBackups } from "../domain/backup";
  
  export const backupsApi = createApi({
    reducerPath: "backupsApi",
    tagTypes: ["Backup"],
    baseQuery: baseQueryWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/backup`),
    endpoints: (builder) => ({
    
      latest: builder.query<LatestBackups, void>({
        query: () => {        
          return {
            url: "/latest",
          };
        },
      }),
  
      space: builder.query<BackupSpace, void>({
        query: () => ({
          url: "/space",
        }),
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
    useSpaceQuery,
    useStartMutation,
    useDeleteMutation
    // useDeleteResourceMutation,
  } = backupsApi;
  