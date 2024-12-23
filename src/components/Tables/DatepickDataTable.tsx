import React, { useCallback, useMemo } from 'react';
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  Column,
} from 'react-table';
import Dropdown from '../Dropdowns/Dropdown';
import DatePicker from '../Forms/DatePicker/DatePicker';
import { showToast, ToastType } from '../../ToastContainer';
import { t } from 'i18next';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import EmptyDatePicker from '../Forms/DatePicker/EmptyDatePicker';
import { fetchExcelData } from '../../api';
import { E_ROLE_TYPES } from '../../enum';

interface DatepickDataTableProps<T extends object> {
  title?: string;
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onPwReset?: (item: T) => void;
  onDelete?: (item: T) => void;
  enableActions?: boolean;
  additionalButtonArea?: React.ReactNode;
  selectedDates: string[];
  setSelectedDates: (item: string[]) => void;
  excelReportName: string;
  excelDownloadEndpoint: string;
  datepickerMinDate?: string;
  datepickerMaxDate?: string;
}

const DatepickDataTable = <T extends object>({
  title,
  data,
  columns,
  onEdit,
  onPwReset,
  onDelete,
  enableActions = false,
  additionalButtonArea = <></>,
  selectedDates,
  setSelectedDates,
  excelReportName,
  excelDownloadEndpoint,
  datepickerMinDate,
  datepickerMaxDate,
}: DatepickDataTableProps<T>) => {
  const loggedInUser = useRecoilValue(loggedInUserState);

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

  const handleDateChange = useCallback((dates: string[]) => {
    setSelectedDates(dates);
  }, []);

  const handleDownload = async (dates: string[]) => {
    if (loggedInUser?.role === E_ROLE_TYPES.USER) {
      showToast({
        message: t(
          'You do not have permission to use it. Please contact your Manager.',
        ),
        type: ToastType.ERROR,
      });
    } else {
      if (!dates || dates.length < 2) {
        return;
      }

      try {
        // energy/iot-devices -> /report/iot-history/{companyId}
        // ai/anomaly-detection -> /report/anomaly/{companyId}
        // fetchData 함수 호출하여 Blob 데이터 얻기
        let endpoint = `${excelDownloadEndpoint}?startDate=${dates[0]}&endDate=${dates[1]}`;
        if (excelReportName === 'Anomaly_Detection') {
          endpoint = `${excelDownloadEndpoint}?startDateTime=${dates[0]}T00:00:00&endDateTime=${dates[1]}T23:59:59`;
        }
        const blob = await fetchExcelData(`${endpoint}`);

        // 다운로드를 위한 URL 생성
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${excelReportName}_Report ${dates[0]} ~ ${dates[1]}.xlsx`; // 파일 이름 설정
        document.body.appendChild(a);
        a.click();
        a.remove();

        // URL 객체 해제
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error while fetching energy use:', error);
      }
    }
  };

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

        <div
          className={`flex flex-col ${title ? `justify-end` : `justify-between`} gap-2 ${title && `sm:ml-auto`} sm:flex-row sm:items-center`}
        >
          {selectedDates.length > 0 && (
            <>
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
            </>
          )}
          {loggedInUser?.role === E_ROLE_TYPES.USER ? (
            // Datepicker를 사용하는 기간별 검색은 유료 API이므로 User가 사용할 수 없도록 하고 영역만 표시한다. (EmptyDatePicker)
            <EmptyDatePicker
              onClick={() => {
                showToast({
                  message: t(
                    'You do not have permission to use it. Please contact your Manager.',
                  ),
                  type: ToastType.ERROR,
                });
              }}
            />
          ) : (
            <DatePicker
              minDate={datepickerMinDate}
              maxDate={datepickerMaxDate}
              onDateChange={handleDateChange}
            />
          )}
          <button
            onClick={() => handleDownload(selectedDates)}
            className={`flex min-w-24 items-center gap-2 rounded border border-e_green px-4 py-2 text-center font-medium text-e_green hover:bg-e_green hover:bg-opacity-90 hover:text-white dark:bg-primary dark:text-white xsm:max-w-1 md:max-w-40 ${(!selectedDates || selectedDates.length < 2) && 'disabled border-none bg-slate-200 text-zinc-100 hover:bg-slate-200 hover:text-zinc-100'}`}
          >
            <svg
              className="h-5 w-5 cursor-pointer lg:h-6 lg:w-6 sm:h-5 sm:w-5"
              viewBox="0 0 512 512"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Excel Icon"
            >
              <path
                d="M453.547 273.449H372.12V232.735H453.547V273.449ZM453.547 296.713H372.12V337.427H453.547V296.713ZM453.547 104.779H372.12V145.492H453.547V104.779ZM453.547 168.757H372.12V209.47H453.547V168.757ZM453.547 360.691H372.12V401.405H453.547V360.691ZM509.789 440.955C507.463 453.053 492.922 453.343 483.209 453.751H302.326V506.096H266.207L0 459.566V52.4918L267.778 5.90381H302.326V52.2588H476.986C486.816 52.6658 497.634 51.9678 506.183 57.8418C512.174 66.4498 511.593 77.3848 512 87.2718L511.767 390.063C511.477 406.988 513.337 424.263 509.789 440.955ZM213.279 349.699C197.227 317.129 180.884 284.79 164.889 252.219C180.709 220.521 196.297 188.707 211.826 156.892C198.623 157.532 185.42 158.346 172.276 159.277C162.446 183.181 150.988 206.446 143.311 231.165C136.157 207.842 126.677 185.391 118.011 162.65C105.215 163.348 92.419 164.104 79.624 164.86C93.117 194.64 107.484 224.01 120.57 253.964C105.157 283.045 90.733 312.534 75.785 341.789C88.522 342.312 101.26 342.836 113.997 343.01C123.071 319.862 134.354 297.586 142.264 273.972C149.36 299.331 161.399 322.77 171.287 347.023C185.304 348.013 199.262 348.885 213.279 349.699ZM484.26 79.8818H302.326V104.779H348.856V145.492H302.326V168.757H348.856V209.47H302.326V232.735H348.856V273.449H302.326V296.713H348.856V337.427H302.326V360.691H348.856V401.405H302.326V428.302H484.26V79.8818Z"
                fill="black"
              />
            </svg>
            Excel
          </button>
        </div>
        {additionalButtonArea}
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
        {/* Pagination buttons - Centered */}
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

export default DatepickDataTable;
