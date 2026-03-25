import {
  createApi,
} from "@reduxjs/toolkit/query/react";
import baseQueryWithRefresh from "./baseQueryWithRefresh";

import { File } from "../domain/file";

type BasicFile = Pick<File, "id" | "bucket">;

export const filesApi = createApi({
  reducerPath: "filesApi",
  baseQuery: baseQueryWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/file`),
  endpoints: (builder) => ({
    deleteFile: builder.mutation<boolean, BasicFile>({
      query: (file) => ({
        url: `/${file.bucket}/${file.id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteFileMutation } = filesApi;
