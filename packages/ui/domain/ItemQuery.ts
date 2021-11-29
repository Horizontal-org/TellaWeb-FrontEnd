// import { SortingRule } from "react-table";

export type ItemQuery = {
  sort: {
    key: string
    order: string
  },
  search?: string,
  filter: {
    byName?: string;
  };
  pagination: {
    page: number;
    total: number;
    size: number;
  };
};
