import { useEffect, useState } from 'react';
import SeriesIsLoading from '../../components/Charts/SeriesLoading';
import DoubleLineChart from '../../components/Charts/DoubleLineChart';
import { SeriesType } from '../../types/series';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useRecoilValue } from 'recoil';
import {
  getFilteredSeriesValuesExtends,
  getNumberOfDaysInCurrentMonth,
} from '../../initSeries';
import moment from 'moment';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const CurrentMonthEnergyUsageContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const { useEnergyMonthly } = queries();
  const {
    data: energyMonthlyData,
    error,
    isLoading,
  } = useEnergyMonthly(loggedInUser?.companyId || 0);
  const currentDate = getCurrentDate(usableLanguages);
  const [seriesIsLoading, setSeriesIsLoading] = useState(false);
  const [series, setSeries] = useState<SeriesType[]>([]);
  // 시리즈 데이터의 갯수는 현재 화면의 컨셉에 따라 x축을 기준으로 정해진다.
  // 월 기준으로 보여야 하는 데이터면 일의 갯수가 표시되는 것
  // 현재월의 일 수 (현재월의 마지막날) = 28 ~ 31
  const xAxisDataLength = getNumberOfDaysInCurrentMonth(currentDate);

  useEffect(() => {
    if (energyMonthlyData) {
      setSeries([
        {
          name: t('Current Month Energy Usage'),
          data: getFilteredSeriesValuesExtends({
            type: 'date',
            element: energyMonthlyData.thisMonthData,
            monthValue: moment(currentDate).format('YYYY-MM'),
            dateValue: '',
            filterKey: 'referenceDate',
            valueKey: 'dailyUsage',
          }),
        },
        {
          name: t('AI Predicted Energy Usage'),
          data: getFilteredSeriesValuesExtends({
            type: 'date',
            element: energyMonthlyData.thisMonthData,
            monthValue: moment(currentDate).format('YYYY-MM'),
            dateValue: '',
            filterKey: 'referenceDate',
            valueKey: 'dailyForecastUsage',
          }),
        },
      ]);
    }
  }, [energyMonthlyData]);

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
        <DoubleLineChart
          height={350}
          colors={['#0EA5FF', '#8ED9CA']}
          series={series}
        />
      )}
    </>
  );
};

export default CurrentMonthEnergyUsageContentsWrapper;
