// @ts-nocheck
import { format } from "date-fns";
import { Column } from "react-table";
import { Configuration } from "../../state/domain/configuration";

export const CONFIGURATION_COLUMNS: Column[] = [
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
