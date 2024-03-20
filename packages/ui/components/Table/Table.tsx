// @ts-nocheck
import { FunctionComponent, useEffect, useState, useMemo } from "react";
import { Column, useTable, useRowSelect, useSortBy, usePagination } from "react-table";
import cn from "classnames";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import { FaRegFolder } from "react-icons/fa";
import { IndeterminateCheckbox } from "./IndeterminateCheckbox";
import { Item } from "../../domain/Item";
import { ItemQuery } from "../../domain/ItemQuery";
import { Paginator } from "../Paginator/Paginator";

type Props = {
  columns: Array<Column>;
  data: Array<Item>;
  withPagination?: boolean;
  onSelection?: (items: Item[]) => void;
  onFetch?: (itemQuery: ItemQuery) => void;
  itemQuery?: ItemQuery;
  icon?: React.ReactNode;
  rowOptions: (hoveredRow, isHoverSelected) => React.ReactNode
};

export const Table: FunctionComponent<React.PropsWithChildren<Props>> = ({
  columns,
  data,
  onSelection,
  onFetch,
  itemQuery,
  icon,
  rowOptions,
  withPagination
}: Props) => {
  const tColumns = useMemo<Column[]>(() => columns, []);
  const tData = useMemo(() => data, [data]);
  const [hovering, handleHover] = useState()
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    //pagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { selectedRowIds, pageIndex, pageSize },
  } = useTable(
    {
      columns: tColumns,
      data: tData,
      manualPagination: true,
      initialState: { pageIndex: 0, pageSize: itemQuery.pagination.size },
      autoResetPage: false,
      pageCount: Math.floor(itemQuery.pagination.total / itemQuery.pagination.size) + 1,
      manualSortBy: true,
      disableMultiSort: true,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((col) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div className='flex justify-center w-full'>
              <IndeterminateCheckbox style={{width: 40, height: 40}} {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          className: "max-w-content text-center p-2",
          // eslint-disable-next-line react/display-name
          Cell: ({ row }) => {
            return (
              <div className='flex justify-center'>
                <div style={{width: 20}}>
                  { row.isSelected ? (
                    <IndeterminateCheckbox style={{width: 40, height: 40}}  {...row.getToggleRowSelectedProps()} />
                  ) : icon || <FaRegFolder size={14} color="#8B8E8F"/>}
                </div>
              </div>
            )
          },
        },
        ...col,
      ]);
    }
  );

  useEffect(() => {
    const r = selectedFlatRows.map((d) => d.original) as Item[];
    onSelection(r);
  }, [selectedRowIds, onSelection]);

  useEffect(() => {
    onFetch({
      ...itemQuery,
      pagination: {
        total: itemQuery.pagination.total,
        size: pageSize,
        page: pageIndex
      }
    })
  }, [pageIndex, pageSize])

  return (
    <>
      <table
        {...getTableProps()}
        className={`table-auto border-collapse w-full ${
          getTableProps().className
        }`}
      >
        <thead className="border-b border-gray-200">
          {headerGroups.map((headerGroup, i) => (
            <tr
              key={i}
              {...headerGroup.getHeaderGroupProps()}
              className="rounded-lg text-base font-sans text-gray-300 text-left"
            >
              {headerGroup.headers.map((column, j) => (
                <th
                  disableSortBy={j === 0}
                  key={j}
                  {...column.getHeaderProps([
                    {
                      className: `${column.className} font-semibold text-base`,
                    },
                    column.getSortByToggleProps()
                  ])}
                  onClick={() => {
                    if (j === 0) { 
                      return
                    }

                    onFetch({
                      ...itemQuery,
                      sort: {
                        key: column.headerKey,
                        order: column.isSortedDesc ? 'asc' : 'desc'
                      },
                    })
                    column.toggleSortBy(!column.isSortedDesc)
                  }}
                >
                  <div className="flex flex-row">
                    {column.render("Header")}
                    <span className='pl-2'>
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
          {rows.map((row, i) => {
            prepareRow(row);
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
                key={i}
                style={{
                  height: 50
                }}
                onClick={(e) => {
                  row.toggleRowSelected() 
                }}
                {...row.getRowProps()}
                className={cn(
                  "border-b border-gray-200 hover:border-transparent",
                  'relative',
                  {
                    "bg-blue-light": row.isSelected,
                    "hover:bg-gray-50": !row.isSelected,
                  }
                )}
              >
                {row.cells.map((cell, j) => {
                  return (
                    <td
                      key={j}
                      {...cell.getCellProps([
                        { className: cell.column.className || "px-3 py-3" },
                      ])}
                    >
                      {cell.render("Cell")}
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
                      { rowOptions(row.original, row.isSelected) }
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
            gotoPage={gotoPage}
            previousPage={previousPage}
            nextPage={nextPage}
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageTotal={pageOptions.length}
          />
        </div>
      )}
      
    </>
  );
};

Table.defaultProps = {
  onSelection: () => null,
  onFetch: () => null,
  withPagination: true,
  itemQuery: {
    filter: {},
    sort: [],
    pagination: { page: 1, total: 1, size: 1 },
  },
};
