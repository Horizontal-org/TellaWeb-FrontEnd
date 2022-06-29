// @ts-nocheck
import { format } from "date-fns";
import { Column } from "react-table";
import { User } from "../../state/domain/user";

export const USER_COLUMNS: Column[] = [
  {
    Header: "Name",
    headerKey: 'user.username',
    accessor: (user: User): string => user.username,
    className: "px-3 py-3 w-40 font-semibold",
  },
  {
    Header: "Role",
    headerKey: 'user.role',
    className: "px-3 py-3 w-40",
    id: "date",
    accessor: (user: User): string => user.role,
  }
];
