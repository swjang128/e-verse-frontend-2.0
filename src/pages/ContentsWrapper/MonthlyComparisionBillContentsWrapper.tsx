import { useEffect, useState } from 'react';
import DoubleBarChart from '../../components/Charts/DoubleBarChart';
import SeriesIsLoading from '../../components/Charts/SeriesLoading';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { SeriesType } from '../../types/series';
import {
  getFilteredSeriesValuesExtends,
  getNumberOfHoursInDay,
} from '../../initSeries';
import _ from 'lodash';
import moment from 'moment';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import {
  getCurrentDate,
  getPreviousMonthCurrentDate,
} from '../../hooks/getStringedDate';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';

const MonthlyComparisionBillContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const { useEnergyRealtimeForMain } = queries();
  const {
    data: energyRealtimeDataForMain,
    error,
    isLoading,
  } = useEnergyRealtimeForMain(loggedInUser?.companyId || 0);

  const currentDate = getCurrentDate(usableLanguages);
  const previousMonthCurrentDate = getPreviousMonthCurrentDate(usableLanguages);

  const [seriesIsLoading, setSeriesIsLoading] = useState(false);
  const [series, setSeries] = useState<SeriesType[]>([]);
  const xAxisDataLength = getNumberOfHoursInDay();

  useEffect(() => {
    // getRealTimeBillStatusData - 오늘날짜 데이터와 한달전 오늘날짜 데이터 포함
    if (energyRealtimeDataForMain) {
      setSeries([
        {
          name: t('Real-time Bill Status'),
          data: getFilteredSeriesValuesExtends({
            type: 'hour',
            element: energyRealtimeDataForMain.realTimeData,
            monthValue: moment(currentDate).format('YYYY-MM'),
            dateValue: currentDate,
            filterKey: 'referenceTime',
            valueKey: 'bill',
          }),
        },
        {
          name: t('Previous Month Bill Status'),
          data: getFilteredSeriesValuesExtends({
            type: 'hour',
            element: energyRealtimeDataForMain.lastMonthData,
            monthValue: moment(previousMonthCurrentDate).format('YYYY-MM'),
            dateValue: previousMonthCurrentDate,
            filterKey: 'referenceTime',
            valueKey: 'bill',
          }),
        },
      ]);
    }
  }, [energyRealtimeDataForMain]);

  useEffect(() => {
    // series 데이터가 있을 때 로딩 상태를 false로 설정
    if (
      series.length > 0 &&
      series[0].data.length === xAxisDataLength &&
      series[1].data.length === xAxisDataLength
    ) {
      setSeriesIsLoading(false);
    } else {
      setSeriesIsLoading(true);
    }
  }, [series]);

  return (
    <>
      {seriesIsLoading ? (
        <SeriesIsLoading />
      ) : (
        <DoubleBarChart
          height={350}
          colors={['#3C50E0', '#80CAEE']}
          categories={_.range(0, series[0]?.data.length)}
          series={series}
        />
      )}
    </>
  );
};

export default MonthlyComparisionBillContentsWrapper;
