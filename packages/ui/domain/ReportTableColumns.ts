// @ts-nocheck
import { format } from "date-fns";
import { Column } from "react-table";
import { Report } from "./Report";

export const REPORT_COLUMNS: Column[] = [
  {
    Header: "Name",
    accessor: (report: Report): string => report.title,
    className: "px-3 py-3 w-40 font-semibold",
  },
  {
    Header: "Date",
    className: "px-3 py-3 w-40",
    id: "date",
    accessor: (report: Report): string => format(report.date, "dd MMM yyyy"),
  },
  {
    Header: "User",
    className: "px-3 py-3 w-auto",
    accessor: (report: Report) => report.author.username,
  },
];
