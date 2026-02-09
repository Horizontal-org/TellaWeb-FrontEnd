import {
  createApi,
} from "@reduxjs/toolkit/query/react";
import baseQueryWithRefresh from "./baseQueryWithRefresh";

import { GlobalSetting } from "../domain/global-setting";

export const globalSettingsApi = createApi({
  reducerPath: "globalSettingsApi",
  tagTypes: ["GlobalSetting"],
  baseQuery: baseQueryWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/global-setting`),
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
