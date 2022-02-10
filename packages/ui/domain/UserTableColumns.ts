// @ts-nocheck
import { format } from "date-fns";
import { Column } from "react-table";
import { User } from "../../state/domain/user";

export const USER_COLUMNS: Column[] = [
  {
    Header: "Name",
    accessor: (user: User): string => user.username,
    className: "px-3 py-3 w-40 font-semibold",
  },
  {
    Header: "Date",
    className: "px-3 py-3 w-40",
    id: "date",
    accessor: (user: User): string => {
      const date = new Date(user.createdAt)
      return format(date, "dd MMM yyyy")
    },
  }
];
