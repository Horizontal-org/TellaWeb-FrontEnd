import { SortingRule } from "react-table";

export type ItemQuery = {
  sort: SortingRule<object>[];
  filter: {
    byName?: string;
  };
  pagination: {
    page: number;
    total: number;
    size: number;
  };
};
