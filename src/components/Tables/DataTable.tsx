import React, { useEffect, useMemo, useState } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  Column,
} from 'react-table';
import Dropdown from '../Dropdowns/Dropdown';
import { t } from 'i18next';
import CompanyDropdown from '../Dropdowns/CompanyDropdown';

interface DataTableProps<T extends object> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onPwReset?: (item: T) => void;
  onUsagePop?: (item: T) => void;
  onDelete?: (item: T) => void;
  enableActions?: boolean;
  additionalButtonArea?: React.ReactNode;
}

const DataTable = <T extends object>({
  title,
  data,
  columns,
  onEdit,
  onPwReset,
  onUsagePop,
  onDelete,
  enableActions = false,
  additionalButtonArea = <></>,
}: DataTableProps<T>) => {
  // Optionally add the actions column
  const enhancedColumns = useMemo(() => {
    if (enableActions && onEdit && onPwReset && onDelete) {
      return [
        ...columns,
        {
          Header: '',
          accessor: 'actions',
          disableSortBy: true,
          Cell: ({ row }: { row: any }) => (
            <div className="col-span-4 lg:col-span-2">
              <Dropdown
                onEdit={() => onEdit(row.original)}
                onPwReset={() => onPwReset(row.original)}
                onDelete={() => onDelete(row.original)}
              />
            </div>
          ),
        },
      ];
    } else if (enableActions && onEdit && onUsagePop && onDelete) {
      return [
        ...columns,
        {
          Header: '',
          accessor: 'actions',
          disableSortBy: true,
          Cell: ({ row }: { row: any }) => (
            <div className="col-span-4 lg:col-span-2">
              <CompanyDropdown
                onEdit={() => onEdit(row.original)}
                onUsagePop={() => onUsagePop(row.original)}
                onDelete={() => onDelete(row.original)}
              />
            </div>
          ),
        },
      ];
    }
    return columns;
  }, [columns, enableActions, onEdit, onPwReset, onDelete]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    gotoPage,
  } = useTable<T>(
    {
      columns: enhancedColumns as Column<T>[],
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const { globalFilter, pageIndex, pageSize } = state;

  let targetIndex = 10;
  if (pageIndex > 4) {
    targetIndex = pageIndex - 4 + 10;
  }

  return (
    <div className="data-table-common dark:border-strokedark dark:bg-boxdark">
      <div className="flex min-h-11 flex-col items-start gap-2 border-b border-stroke px-7 pb-4 dark:border-strokedark sm:flex-row sm:items-center sm:justify-between">
        {title && (
          <h3 className="mb-4 text-xl font-semibold text-black dark:text-white sm:mb-0">
            {title}
          </h3>
        )}

        {data.length > 0 && (
          <>
            <div
              className={`flex flex-col ${title ? `justify-end` : `justify-between`} gap-2 ${title && `sm:ml-auto`} sm:flex-row sm:items-center`}
            >
              <input
                type="text"
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="mb-2 rounded border border-stroke px-4.5 py-2 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary sm:mb-0"
                placeholder={t('Search...')}
              />

              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="mb-2 h-full rounded border border-stroke px-2 py-2 focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary sm:mb-0"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            {additionalButtonArea}
          </>
        )}
      </div>

      <table
        {...getTableProps()}
        className="datatable-table w-full table-auto border-collapse overflow-hidden break-words px-7.5 md:table-fixed md:overflow-auto"
      >
        <thead className="text-black dark:text-white">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={index === 0 ? { paddingLeft: '30px' } : {}}
                  key={column.id}
                >
                  <div className="flex items-center">
                    <span>{column.render('Header')}</span>
                    {!column.disableSortBy && (
                      <div className="ml-2 inline-flex flex-col space-y-[2px]">
                        <span className="inline-block">
                          <svg
                            className="fill-current"
                            width="10"
                            height="5"
                            viewBox="0 0 10 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5 0L0 5H10L5 0Z" fill="" />
                          </svg>
                        </span>
                        <span className="inline-block">
                          <svg
                            className="fill-current"
                            width="10"
                            height="5"
                            viewBox="0 0 10 5"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z"
                              fill=""
                            />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page && page.length > 0 ? (
            page.map((row: any) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell: any, index: number) => (
                    <td
                      {...cell.getCellProps()}
                      style={index === 0 ? { paddingLeft: '30px' } : {}}
                      key={cell.column.id}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                className="text-center"
                colSpan={
                  enableActions && onEdit && onPwReset && onDelete
                    ? columns.length + 1
                    : columns.length
                }
              >
                {t('No data available')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-stroke px-7.5 pt-5 dark:border-strokedark">
        {page && page.length > 0 && (
          <>
            <div className="mx-auto flex items-center space-x-2">
              <button
                className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:text-primary"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.1777 16.1156C12.009 16.1156 11.8402 16.0593 11.7277 15.9187L5.37148 9.44995C5.11836 9.19683 5.11836 8.80308 5.37148 8.54995L11.7277 2.0812C11.9809 1.82808 12.3746 1.82808 12.6277 2.0812C12.8809 2.33433 12.8809 2.72808 12.6277 2.9812L6.72148 8.99995L12.6559 15.0187C12.909 15.2718 12.909 15.6656 12.6559 15.9187C12.4871 16.0312 12.3465 16.1156 12.1777 16.1156Z"
                    fill=""
                  />
                </svg>
              </button>

              {pageOptions.map((_: any, index: number) => {
                if (index + 5 > pageIndex && index < targetIndex) {
                  return (
                    <button
                      key={index}
                      onClick={() => gotoPage(index)}
                      className={`${
                        pageIndex === index
                          ? 'bg-primary text-white hover:text-white'
                          : ''
                      } mx-1 flex cursor-pointer items-center justify-center rounded-md p-1 px-3 hover:text-primary`}
                    >
                      {index + 1}
                    </button>
                  );
                }
              })}

              <button
                className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:text-primary"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                <svg
                  className="fill-current"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.82148 16.1156C5.65273 16.1156 5.51211 16.0593 5.37148 15.9468C5.11836 15.6937 5.11836 15.3 5.37148 15.0468L11.2777 8.99995L5.37148 2.9812C5.11836 2.72808 5.11836 2.33433 5.37148 2.0812C5.62461 1.82808 6.01836 1.82808 6.27148 2.0812L12.6277 8.54995C12.8809 8.80308 12.8809 9.19683 12.6277 9.44995L6.27148 15.9187C6.15898 16.0312 5.99023 16.1156 5.82148 16.1156Z"
                    fill=""
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataTable;
