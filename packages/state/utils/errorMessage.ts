import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"

// The backend returns errors as { message }; RTK Query types the body as unknown
export const errorMessage = (error: FetchBaseQueryError): string | undefined =>
  (error.data as { message?: string } | undefined)?.message
