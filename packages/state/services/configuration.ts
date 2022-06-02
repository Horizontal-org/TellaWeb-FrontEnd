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
import { Configuration, ConfigurationQuery, Camouflage } from "../domain/configuration";
import { CrashReport } from "packages/ui/proto/configuration";

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

export const configurationApi = createApi({
  reducerPath: "configurationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/config`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootStore).auth;
      if (!accessToken) return headers;

      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
  }) as CustomFetchBaseQuery,
  endpoints: (builder) => ({
  
    list: builder.query<Pagination<Configuration>, ConfigurationQuery>({
      query: (configurationQuery) => {
        const params = {
          limit: configurationQuery.size,
          offset: configurationQuery.page * configurationQuery.size,
          sort: configurationQuery.sortKey,
          order: configurationQuery.sortOrder,
          search: configurationQuery.search,
        };

        return {
          url: "/",
          params,
        };
      },
    }),

    createConfiguration: builder.mutation<Configuration, { 
      name: string, 
      camouflage?: Camouflage,
      crashReports?: CrashReport,
      serversVisible?: boolean
    }>({
      query: ({ name, camouflage }) => ({
        url: `/`,
        method: "POST",
        body: {
          name,
          camouflage: JSON.stringify(
            {
              visible: true,
              calculator: true,
              change_name: true
            }
          ),
          crashReports: JSON.stringify(
            {
              visible: true,
              enabled: true,
            }
          ),
          serversVisible: true
        },
      }),
    }),

    getById: builder.query<Configuration, string>({
      query: (configurationId) => {
        return {
          url: `/${configurationId}`
        }
      }
    }),

    updateConfiguration: builder.mutation<Configuration, 
    { 
      id: string
      name: string
      camouflage: Camouflage
      crashReports: CrashReport
      serversVisible: boolean 
    }>({
      query: ({ 
        id,
        name, 
        camouflage, 
        crashReports,
        serversVisible 
      }) => ({
        url: `/${id}`,
        method: "POST",
        body: {
          id,
          name, 
          serversVisible, 
          camouflage: JSON.stringify(camouflage), 
          crashReports: JSON.stringify(crashReports),
        },
      }),
    }),

    deleteConfiguration: builder.mutation<boolean, string>({
      query: (configurationId) => ({
        url: `/${configurationId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useListQuery,
  useCreateConfigurationMutation,
  useLazyGetByIdQuery,
  useUpdateConfigurationMutation,
  useDeleteConfigurationMutation
} = configurationApi;
