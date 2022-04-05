// @ts-nocheck
import { format } from "date-fns";
import { Column } from "react-table";
import { Report } from "./Report";

export const REPORT_COLUMNS: Column[] = [
  {
    Header: "Name",
    headerKey: 'report.title',
    accessor: (report: Report): string => report.title,
    className: "px-3 py-3 w-40 font-semibold",
  },
  {
    Header: "Date",
    headerKey: 'report.createdAt',
    className: "px-3 py-3 w-40",
    id: "date",
    accessor: (report: Report): string => format(report.date, "dd MMM yyyy"),
  },
  {
    Header: "User",
    headerKey: 'author.username',
    className: "px-3 py-3 w-auto",
    accessor: (report: Report) => report.author.username,
  },
];
