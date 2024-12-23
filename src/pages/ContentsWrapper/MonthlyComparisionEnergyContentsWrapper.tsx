import { useEffect, useState } from 'react';
import DoubleLineChart from '../../components/Charts/DoubleLineChart';
import SeriesIsLoading from '../../components/Charts/SeriesLoading';
import { SeriesType } from '../../types/series';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useRecoilValue } from 'recoil';
import _ from 'lodash';
import {
  getFilteredSeriesValuesExtends,
  getNumberOfHoursInDay,
} from '../../initSeries';
import moment from 'moment';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import {
  getCurrentDate,
  getPreviousMonthCurrentDate,
} from '../../hooks/getStringedDate';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';

const MonthlyComparisionEnergyContentsWrapper = () => {
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
  // 시리즈 데이터의 갯수는 현재 화면의 컨셉에 따라 x축을 기준으로 정해진다.
  // 일 기준으로 보여야 하는 데이터면 시간의 갯수가 표시되는 것
  // 하루 총 시간수 = 24
  const xAxisDataLength = getNumberOfHoursInDay();

  useEffect(() => {
    // getRealTimeEnergyUsageData - 오늘날짜 데이터와 한달전 오늘날짜 데이터 포함
    if (energyRealtimeDataForMain) {
      setSeries([
        {
          name: t('Real-time Energy Usage'),
          data: getFilteredSeriesValuesExtends({
            type: 'hour',
            element: energyRealtimeDataForMain.realTimeData,
            monthValue: moment(currentDate).format('YYYY-MM'),
            dateValue: currentDate,
            filterKey: 'referenceTime',
            valueKey: 'usage',
          }),
        },
        {
          name: t('Previous Month Energy Usage'),
          data: getFilteredSeriesValuesExtends({
            type: 'hour',
            element: energyRealtimeDataForMain.lastMonthData,
            monthValue: moment(previousMonthCurrentDate).format('YYYY-MM'),
            dateValue: previousMonthCurrentDate,
            filterKey: 'referenceTime',
            valueKey: 'usage',
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
        <DoubleLineChart
          height={350}
          colors={['#3C50E0', '#80CAEE']}
          annotations={{
            yaxis: [
              // y:이상탐지 최소치, y2:이상탐지 최대치 설정값
              {
                y: 10000,
                strokeDashArray: 3,
                borderColor: '#775DD0',
                label: {
                  borderColor: '#775DD0',
                  style: {
                    color: '#775DD0',
                    // background: 'red',
                  },
                  text: 'Max',
                },
              },
            ],
          }}
          categories={_.range(0, series[0]?.data.length)}
          series={series}
        />
      )}
    </>
  );
};

export default MonthlyComparisionEnergyContentsWrapper;
