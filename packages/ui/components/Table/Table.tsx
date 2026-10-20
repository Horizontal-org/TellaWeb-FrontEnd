import { FunctionComponent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  PaginationState,
  RowSelectionState,
  SortingState,
  flexRender,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import cn from "classnames";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { FaRegFolder } from "react-icons/fa";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { Item } from "../../domain/Item";
import { ItemQuery } from "../../domain/ItemQuery";
import { Paginator } from "../Paginator/Paginator";

// Column definition used by the list pages (domain/*TableColumns.ts). headerKey is the field the
// backend sorts by when the header is clicked
export type TableColumn<T = any> = {
  Header: string;
  accessor?: string | ((row: T) => ReactNode);
  id?: string;
  className?: string;
  headerKey?: string;
};

type ColumnMeta = { className?: string; headerKey?: string };

// TanStack Table 9 only includes the features a table registers. Sorting and pagination are done
// by the server (manual modes), so no sorted or paginated row models are needed
const features = tableFeatures({
  rowSortingFeature,
  rowSelectionFeature,
  rowPaginationFeature,
  columnMeta: metaHelper<ColumnMeta>(),
});

type Features = typeof features;

type Props = {
  columns: Array<TableColumn>;
  data: Array<Item>;
  withPagination?: boolean;
  onSelection?: (items: Item[]) => void;
  onFetch?: (itemQuery: ItemQuery) => void;
  itemQuery?: ItemQuery;
  icon?: React.ReactNode;
  rowOptions: (hoveredRow, isHoverSelected) => React.ReactNode
};

const DEFAULT_ITEM_QUERY = {
  filter: {},
  sort: [],
  pagination: { page: 1, total: 1, size: 1 },
} as unknown as ItemQuery;

const SELECTION_COLUMN_ID = "selection";

// Only cursor: pointer, like react-table 7's checkbox props (which replaced the 40x40 size)
const CHECKBOX_STYLE = { cursor: "pointer" };

const toColumnDef = (column: TableColumn): ColumnDef<Features, Item> => {
  const id = column.id ?? (typeof column.accessor === "string" ? column.accessor : column.Header);
  const meta: ColumnMeta = { className: column.className, headerKey: column.headerKey };
  if (typeof column.accessor === "function") {
    return { id, header: column.Header, accessorFn: column.accessor, meta };
  }
  return { id, header: column.Header, accessorKey: column.accessor ?? id, meta };
};

export const Table: FunctionComponent<React.PropsWithChildren<Props>> = ({
  columns,
  data,
  onSelection = () => null,
  onFetch = () => null,
  itemQuery = DEFAULT_ITEM_QUERY,
  icon,
  rowOptions,
  withPagination = true,
}: Props) => {
  const [hovering, handleHover] = useState<number | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: itemQuery.pagination.size,
  });

  const tColumns = useMemo<ColumnDef<Features, Item>[]>(
    () => [
      {
        id: SELECTION_COLUMN_ID,
        meta: { className: "max-w-content text-center p-2" },
        enableSorting: false,
        header: ({ table }) => (
          <div className='flex justify-center w-full'>
            <IndeterminateCheckbox
              title="Toggle All Rows Selected"
              style={CHECKBOX_STYLE}
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className='flex justify-center'>
            <div style={{width: 20}}>
              { row.getIsSelected() ? (
                <IndeterminateCheckbox
                  title="Toggle Row Selected"
                  style={CHECKBOX_STYLE}
                  checked={row.getIsSelected()}
                  indeterminate={false}
                  onChange={(e) => row.toggleSelected(e.target.checked)}
                />
              ) : icon || <FaRegFolder size={14} color="#8B8E8F"/>}
            </div>
          </div>
        ),
      },
      ...columns.map(toColumnDef),
    ],
    []
  );

  const table = useTable({
    features,
    columns: tColumns,
    data,
    manualPagination: true,
    manualSorting: true,
    enableMultiSort: false,
    autoResetPageIndex: false,
    pageCount: Math.max(1, Math.ceil((itemQuery.pagination.total || 0) / itemQuery.pagination.size)),
    state: { sorting, rowSelection, pagination },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  });

  // Selection is cleared when new data arrives (react-table 7 did this by default)
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) setRowSelection({});
    mounted.current = true;
  }, [data]);

  useEffect(() => {
    onSelection(table.getSelectedRowModel().flatRows.map((row) => row.original));
  }, [rowSelection, onSelection]);

  useEffect(() => {
    onFetch({
      ...itemQuery,
      pagination: {
        total: itemQuery.pagination.total,
        size: pagination.pageSize,
        page: pagination.pageIndex
      }
    })
  }, [pagination.pageIndex, pagination.pageSize])

  // Server-side sort: unsorted or ascending → descending, descending → ascending
  const sortBy = (columnId: string, meta: ColumnMeta) => {
    const current = sorting.find((s) => s.id === columnId);
    const desc = !(current && current.desc);
    onFetch({
      ...itemQuery,
      sort: {
        key: meta?.headerKey,
        order: desc ? 'desc' : 'asc'
      },
    })
    setSorting([{ id: columnId, desc }]);
  };

  const rows = table.getRowModel().rows;

  return (
    <>
      <table className="table-auto border-collapse w-full">
        <thead className="border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="rounded-lg text-base font-sans text-gray-300 text-left"
            >
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta;
                const sortable = header.column.id !== SELECTION_COLUMN_ID;
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`${meta?.className} font-semibold text-base`}
                    title={sortable ? "Toggle SortBy" : undefined}
                    style={sortable ? { cursor: "pointer" } : undefined}
                    onClick={() => {
                      if (!sortable) return
                      sortBy(header.column.id, meta)
                    }}
                  >
                    <div className="flex flex-row">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <span className='pl-2'>
                        {sorted === "desc" ? (
                          <MdExpandMore />
                        ) : sorted === "asc" ? (
                          <MdExpandLess />
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="text-base text-gray-700">
          {rows.map((row, i) => {
            return (
              <tr
                onMouseEnter={() => {
                  handleHover(i)
                }}
                onMouseLeave={() => {
                  if (hovering === i) {
                    handleHover(null)
                  }
                }}
                key={row.id}
                style={{
                  height: 50
                }}
                onClick={() => {
                  row.toggleSelected()
                }}
                className={cn(
                  "border-b border-gray-200 hover:border-transparent",
                  'relative',
                  {
                    "bg-blue-light": row.getIsSelected(),
                    "hover:bg-gray-50": !row.getIsSelected(),
                  }
                )}
              >
                {row.getAllCells().map((cell) => {
                  const meta = cell.column.columnDef.meta;
                  return (
                    <td
                      key={cell.id}
                      className={meta?.className || "px-3 py-3"}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}

                { hovering === i && (
                  <div
                    className="absolute top-0"
                    style={{
                      right: 20
                    }}
                  >
                    <div
                      className="flex items-center "
                      style={{
                        height: 50,
                        paddingRight: '20'
                      }}
                    >
                      { rowOptions(row.original, row.getIsSelected()) }
                    </div>
                  </div>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      { withPagination && (
        <div className='w-full flex justify-center item-center py-8'>
          <Paginator
            gotoPage={(index) => table.setPageIndex(index)}
            previousPage={() => table.previousPage()}
            nextPage={() => table.nextPage()}
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            pageCount={table.getPageCount()}
            pageIndex={pagination.pageIndex}
            pageTotal={table.getPageCount()}
          />
        </div>
      )}

    </>
  );
};
