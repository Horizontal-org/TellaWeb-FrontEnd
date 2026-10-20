import { format } from "date-fns";
import { TableColumn } from "../components/Table/Table";
import { User } from "../../state/domain/user";

export const USER_COLUMNS: TableColumn[] = [
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
