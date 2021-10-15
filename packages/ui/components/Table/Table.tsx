// @ts-nocheck
import { FunctionComponent, useEffect, useMemo } from "react";
import { Column, useTable, useRowSelect, useSortBy } from "react-table";
import cn from "classnames";
import { MdExpandMore } from "@react-icons/all-files/md/MdExpandMore";
import { MdExpandLess } from "@react-icons/all-files/md/MdExpandLess";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { Item } from "../../domain/Item";
import { ItemQuery } from "../../domain/ItemQuery";

type Props = {
  columns: Array<Column>;
  data: Array<Item>;
  onSelection?: (items: Item[]) => void;
  onFetch?: (itemQuery: ItemQuery) => void;
  itemQuery?: ItemQuery;
};

export const Table: FunctionComponent<Props> = ({
  columns,
  data,
  onSelection,
  onFetch,
  itemQuery,
}: Props) => {
  const tColumns = useMemo<Column[]>(() => columns, []);
  const tData = useMemo(() => data, [data]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds, pageIndex, pageSize },
  } = useTable(
    {
      columns: tColumns,
      data: tData,
      manualPagination: true,
      autoResetPage: false,
      pageCount: itemQuery.pagination.total / itemQuery.pagination.size,
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((col) => [
        {
          id: "selection",
          Header: "",
          className: "max-w-content text-center p-2",
          // eslint-disable-next-line react/display-name
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...col,
      ]);
    }
  );

  useEffect(() => {
    const r = selectedFlatRows.map((d) => d.original) as Item[];
    onSelection(r);
  }, [selectedRowIds, onSelection]);

  return (
    <table
      {...getTableProps()}
      className={`table-auto border-collapse w-full ${
        getTableProps().className
      }`}
    >
      <thead className="border-b border-gray-200">
        {headerGroups.map((headerGroup) => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            className="rounded-lg text-base font-sans text-gray-300 text-left"
          >
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps([
                  {
                    className: `${column.className} font-semibold text-base`,
                  },
                ])}
              >
                <div className="flex flex-row">
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <MdExpandMore />
                      ) : (
                        <MdExpandLess />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="text-base text-gray-700">
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              className={cn(
                "border-b border-gray-200 hover:border-transparent",
                {
                  "bg-blue-light": row.isSelected,
                  "hover:bg-gray-200": !row.isSelected,
                }
              )}
            >
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps([
                      { className: cell.column.className || "px-3 py-3" },
                    ])}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

Table.defaultProps = {
  onSelection: () => null,
  onFetch: () => null,
  itemQuery: {
    filter: {},
    sort: [],
    pagination: { page: 1, total: 1, size: 1 },
  },
};
