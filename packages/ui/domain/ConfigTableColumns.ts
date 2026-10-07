import { format } from "date-fns";
import { TableColumn } from "../components/Table/Table";
import { Configuration } from "../../state/domain/configuration";

export const CONFIGURATION_COLUMNS: TableColumn[] = [
  {
    Header: "Name",
    headerKey: 'configuration.name',
    accessor: (configuration: Configuration): string => configuration.name,
    className: "px-3 py-3 w-40 font-semibold",
  },
  {
    Header: "Date",
    headerKey: 'configuration.createdAt',
    className: "px-3 py-3 w-40",
    id: "date",
    accessor: (configuration: Configuration): string => {
      const date = new Date(configuration.createdAt)
      return format(date, "dd MMM yyyy")
    },
  }
];
