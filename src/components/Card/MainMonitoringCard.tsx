import { useEffect, useState } from 'react';
import RadialBarChart from '../Charts/RadialBarChart';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import SeriesIsLoading from '../Charts/SeriesLoading';
import {
  getCurrentDate,
  getCurrentDateDetails,
} from '../../hooks/getStringedDate';
import moment from 'moment';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';

const MainMonitoringCard = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const { useEnergyMonthly, useApiCallLogWithDate } = queries();
  const {
    data: energyMonthlyData,
    error,
    isLoading,
  } = useEnergyMonthly(loggedInUser?.companyId || 0);
  const currentDate = getCurrentDate(usableLanguages);
  const { data: apiCallLogWithDateData } = useApiCallLogWithDate(
    loggedInUser?.companyId || 0,
    currentDate,
  );
  const [seriesIsLoading, setSeriesIsLoading] = useState(true);
  const [series, setSeries] = useState<any[]>([]);
  const [isPreviousMonthGreater, setIsPreviousMonthGreater] = useState(true); // 전월이 더 큼
  const [sumCurrentMonthBill, setSumCurrentMonthBill] = useState<string>();
  const [differencePreviousMonthUsage, setDifferencePreviousMonthUsage] =
    useState<string>();
  const [sumCurrentMonthApiCallCount, setSumCurrentMonthApiCallCount] =
    useState<string>();

  const [currentDateTime, setCurrentDateTime] = useState(
    getCurrentDateDetails(usableLanguages),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(getCurrentDateDetails(usableLanguages));
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (energyMonthlyData) {
      setSeries([energyMonthlyData.thisMonthData.summaryUsage]);
      setSumCurrentMonthBill(
        Math.round(energyMonthlyData.thisMonthData.summaryBill).toLocaleString(
          'en-US',
        ),
      );
      if (
        Number(energyMonthlyData.thisMonthData.summaryUsage) >
        Number(energyMonthlyData.lastMonthData.summaryUsage)
      ) {
        // 당월이 더 큼 = 전월이 더 큼을 false처리
        setIsPreviousMonthGreater(false);
      }
      setDifferencePreviousMonthUsage(
        Number(energyMonthlyData.lastMonthData.summaryUsage) === 0
          ? '0'
          : Math.abs(
              100 -
                Math.round(
                  (Number(energyMonthlyData.thisMonthData.summaryUsage) /
                    Number(energyMonthlyData.lastMonthData.summaryUsage)) *
                    100,
                ),
            ).toString(),
      );
    }
  }, [energyMonthlyData]);

  useEffect(() => {
    if (apiCallLogWithDateData) {
      setSumCurrentMonthApiCallCount(
        Math.round(
          apiCallLogWithDateData.monthlyChargeableApiCalls,
        ).toLocaleString('en-US'),
      );
    }
  }, [apiCallLogWithDateData]);

  useEffect(() => {
    // series 데이터가 있을 때 로딩 상태를 false로 설정
    if (series.length > 0) {
      setSeriesIsLoading(false);
    } else {
      setSeriesIsLoading(true);
    }
  }, [series]);

  return (
    <div className="grid-row col-span-12 grid gap-4 rounded bg-white text-black shadow-default dark:bg-boxdark dark:text-white xl:col-span-4">
      <div className="flex items-center justify-center rounded-t bg-red-400 bg-gradient-to-r from-e_green to-e_blue py-2 text-white">
        {`${currentDate} ${currentDateTime.time}`}
      </div>
      <div className="px-7 pb-4">
        <div className="flex justify-center">
          <span className="text-lg font-semibold">
            {moment(currentDate).format('YYYY-MM')} {t('Summary')}
          </span>
        </div>
        {seriesIsLoading ? (
          <SeriesIsLoading />
        ) : (
          <RadialBarChart height={300} colors={['#59B376']} series={series} />
        )}
        <div className="flex items-baseline justify-center gap-1 text-e_green">
          <span className="font-semibold text-black">{t('MoM')}</span>
          {isPreviousMonthGreater === true ? (
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.85279 1.67984e-07L8.62907 6.02868e-07L8.62907 6.56566L12.4819 6.56566L6.24093 13L-8.14759e-05 6.56566L3.85279 6.56566L3.85279 1.67984e-07Z"
                fill="#136D61"
              />
            </svg>
          ) : (
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ transform: 'rotate(180deg)' }}
            >
              <path
                d="M3.85279 1.67984e-07L8.62907 6.02868e-07L8.62907 6.56566L12.4819 6.56566L6.24093 13L-8.14759e-05 6.56566L3.85279 6.56566L3.85279 1.67984e-07Z"
                fill="#136D61"
              />
            </svg>
          )}
          <span className="font-semibold">{differencePreviousMonthUsage}</span>
          <span className="text-xs">%</span>
        </div>
        <div>
          <div className="flex justify-between font-semibold">
            <span>{t('Bill')}</span>
            <span>{t('API Calls')}</span>
          </div>
          <div className="flex flex-row items-baseline justify-between gap-4 text-e_green">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold">
                {sumCurrentMonthBill}
              </span>
              <span className="text-xs">&#36;</span>
            </div>
            <span className="text-2xl font-semibold">
              {sumCurrentMonthApiCallCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMonitoringCard;
