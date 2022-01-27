export interface Pagination<TData> {
  total: number;
  limit: number;
  offset: number;
  results: TData[];
}
