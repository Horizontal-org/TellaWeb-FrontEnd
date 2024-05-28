import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { RootStore } from "../../state/store";
import { GlobalSetting } from "../domain/global-setting";

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

export const globalSettingsApi = createApi({
  reducerPath: "globalSettingsApi",
  tagTypes: ["GlobalSetting"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/global-setting`,
    prepareHeaders: (headers, { getState }) => {
      const { accessToken } = (getState() as RootStore).auth;
      if (!accessToken) return headers;

      headers.set("authorization", `Bearer ${accessToken}`);
      return headers;
    },
  }) as CustomFetchBaseQuery,
  endpoints: (builder) => ({
    list: builder.query<GlobalSetting[], void>({
      query: () => {
        return {
          url: "/",
          method: "GET",
        };
      },
    }),
    updateGlobalSetting: builder.mutation<boolean, { id: string, enabled: boolean}> ({
      query: ({id, enabled}) => ({
        url: "/",
        method: "PUT",
        body: {
          id,
          enabled
        }
      })
    }),
  }),
});


export const {
  useListQuery,
  useUpdateGlobalSettingMutation
} = globalSettingsApi;
