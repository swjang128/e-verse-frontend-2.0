import { useCallback, useEffect, useState } from 'react';
import { fetchData, fetchExcelData } from '../../api';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { getFilteredSeriesValues } from '../../initSeries';
import DatePicker from '../../components/Forms/DatePicker/DatePicker';
import DoubleLineChart from '../../components/Charts/DoubleLineChart';
import { showToast, ToastType } from '../../ToastContainer';
import { SeriesType } from '../../types/series';
import _ from 'lodash';
import { t } from 'i18next';
import EmptyDatePicker from '../../components/Forms/DatePicker/EmptyDatePicker';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import {
  getCurrentDate,
  getHarfYearAgoCurrentDate,
} from '../../hooks/getStringedDate';
import { E_ROLE_TYPES } from '../../enum';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';

interface PastTotalHistoryContentsWrapperProps {
  selectedDates: string[];
  setSelectedDates: (dates: string[]) => void;
  setSearchedData: (searchedData: any[]) => void;
}

const PastTotalHistoryContentsWrapper: React.FC<
  PastTotalHistoryContentsWrapperProps
> = ({ selectedDates, setSelectedDates, setSearchedData }) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const queryClient = useQueryClient();
  const [series, setSeries] = useState<SeriesType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [changedSeries, setChangedSeries] = useState<boolean>(false);

  const getDatesBetween = (startDate: string, endDate: string): string[] => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T23:59:59`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format');
    }

    const days =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return _.map(_.range(days), (offset) => {
      const date = new Date(start);
      date.setDate(date.getDate() + offset);
      return moment(date).format('YYYY-MM-DD');
    });
  };

  const handleDateChange = useCallback((dates: string[]) => {
    setSelectedDates(dates);
    setChangedSeries(true);
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
        // ai/saving-report -> /report/energy/{companyId}
        // fetchData 함수 호출하여 Blob 데이터 얻기
        const blob = await fetchExcelData(
          `/report/energy/${loggedInUser?.companyId}?startDate=${dates[0]}&endDate=${dates[1]}`,
        );

        // 다운로드를 위한 URL 생성
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Energy_Total_Report ${dates[0]} ~ ${dates[1]}.xlsx`; // 파일 이름 설정
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

  // 날짜 범위에 따라 차트를 업데이트
  useEffect(() => {
    // 검색된 PastTotalHistory 데이타
    const getSearchedPastData = async (dates: string[]) => {
      try {
        const response = await fetchData(
          `/energy/${loggedInUser?.companyId}?startDate=${dates[0]}&endDate=${dates[1] || dates[0]}`,
        );
        // response.data.monthlyResponse를 details와 searchedData 공유하여 API Call Count 1건으로 처리
        setSearchedData(response.data.monthlyResponse);

        // setSeries 영역
        setSeries([
          {
            name: t('Daily Energy Usage'),
            data: getFilteredSeriesValues({
              type: 'etc',
              element: response.data.monthlyResponse,
              typedValue: '',
              filterKey: 'referenceDate',
              valueKey: 'dailyUsage',
              range: 0,
            }),
          },
          {
            name: t('Daily Bill Status'),
            data: getFilteredSeriesValues({
              type: 'etc',
              element: response.data.monthlyResponse,
              typedValue: '',
              filterKey: 'referenceDate',
              valueKey: 'dailyBill',
              range: 0,
            }),
          },
        ]);
        setCategories(getDatesBetween(dates[0], dates[1] || dates[0]));
        setChangedSeries(true);
      } catch (error) {
        console.error('Error while logging in:', error);
        return [];
        // 에러 처리
      } finally {
        // 유료 API 이므로 Main의 API Call Count를 갱신키 위해 invalidate한다.
        queryClient.invalidateQueries({
          queryKey: [
            'apiCallLogWithDate',
            loggedInUser?.companyId,
            getCurrentDate(usableLanguages),
          ],
        });
      }
    };

    const getTotalDataByChangeDates = async () => {
      if (selectedDates.length > 0) {
        getSearchedPastData(selectedDates);
      }
      // const chartData = await getSearchedPastData(selectedDates); // 함수 호출

      // 차트 데이터의 최대값 계산
      // const maxDataValue = chartData ? Math.max(...chartData) : 0;

      // 최대값을 기반으로 y축 최대값 설정
      // const yAxisMax = Math.round(maxDataValue / 10000) * 10000 + 10000; // 10,000 단위로 올림하고 10,000 추가

      // 해당 월 일수만큼 x열 설정
      //   setOptions((prevOptions) => ({
      //     ...prevOptions,
      //     xaxis: {
      //       ...prevOptions.xaxis,
      //       categories: datesArray,
      //     },
      //     yaxis: {
      //       ...prevOptions.yaxis,
      //       max: yAxisMax, // 동적으로 계산한 최대값 설정
      //     },
      //   }));
    };
    getTotalDataByChangeDates();
  }, [selectedDates]);

  return (
    <>
      <div className="flex min-h-11 flex-col items-start gap-2 pb-4 dark:border-strokedark sm:flex-row sm:items-center sm:justify-between">
        <h3 className="mb-4 text-xl font-semibold text-black dark:text-white sm:mb-0">
          {t('Past Total History')}
        </h3>
        <div className="flex flex-col justify-end gap-2 sm:ml-auto sm:flex-row sm:items-center">
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
              minDate={getHarfYearAgoCurrentDate(usableLanguages)}
              maxDate={getCurrentDate(usableLanguages)}
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
      </div>
      <DoubleLineChart
        height={350}
        colors={['#0EA5FF', '#8ED9CA']}
        categories={categories}
        series={series}
        changedSeries={changedSeries}
        setChangedSeries={setChangedSeries}
      />
    </>
  );
};

export default PastTotalHistoryContentsWrapper;
