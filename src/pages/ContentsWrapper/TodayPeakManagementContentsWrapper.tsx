import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useEffect, useState } from 'react';
import { SeriesType } from '../../types/series';
import {
  getFilteredSeriesValuesExtends,
  getNumberOfHoursInDay,
} from '../../initSeries';
import SeriesIsLoading from '../../components/Charts/SeriesLoading';
import _ from 'lodash';
import LineChart from '../../components/Charts/LineChart';
import moment from 'moment';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const TodayPeakManagementContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useEnergyRealtime, useHourlyRates } = queries();
  const {
    data: energyRealtimeData,
    error,
    isLoading,
  } = useEnergyRealtime(loggedInUser?.companyId || 0);
  const { data: hourlyRatesData } = useHourlyRates(
    loggedInUser?.companyId || 0,
  );

  const usableLanguages = useRecoilValue(usableLanguagesState);
  const currentDate = getCurrentDate(usableLanguages);
  const [seriesIsLoading, setSeriesIsLoading] = useState(false);
  const [series, setSeries] = useState<SeriesType[]>([]);
  const xAxisDataLength = getNumberOfHoursInDay();
  const [peakStatusMap, setPeakStatusMap] = useState<any>({});

  const generateXaxisAnnotationsLodash = (hourlyRates: any) => {
    const annotations = {
      xaxis: new Array(),
    };

    const result: any = [];
    let startHour: number | null = null;

    Object.entries(hourlyRates).forEach(
      ([key, value]: any, index, arr: any) => {
        const hour = Number(key);
        const status = value.status;
        const isMidOrPeak = status === 'MID_PEAK' || status === 'PEAK';

        if (isMidOrPeak) {
          if (startHour === null) {
            startHour = hour;
          }

          const nextStatus = arr[index + 1]?.[1]?.status;

          if (nextStatus !== status || index === arr.length - 1) {
            result.push({
              x: startHour,
              x2: hour,
              status: status,
            });
            startHour = null;
          }
        }
      },
    );

    result.forEach(({ x, x2, status }: any) => {
      annotations.xaxis.push({
        x,
        x2,
        fillColor: status === 'PEAK' ? '#EF4444' : '#F97316',
        label: {
          text: status,
          style: {
            color: status === 'PEAK' ? '#FF0000' : '#FF8311',
          },
          position: 'top',
          orientation: 'horizontal',
          offsetY: -15,
        },
      });
    });

    return annotations;
  };

  useEffect(() => {
    // getRealTimeBillStatusData - 오늘날짜 데이터와 한달전 오늘날짜 데이터 포함
    if (energyRealtimeData) {
      setSeries([
        {
          name: t('Real-time Bill Status'),
          data: getFilteredSeriesValuesExtends({
            type: 'hour',
            element: energyRealtimeData.realTimeData,
            monthValue: moment(currentDate).format('YYYY-MM'),
            dateValue: currentDate,
            filterKey: 'referenceTime',
            valueKey: 'bill',
          }),
        },
      ]);
    }
  }, [energyRealtimeData]);

  useEffect(() => {
    if (hourlyRatesData) {
      setPeakStatusMap(
        generateXaxisAnnotationsLodash(
          hourlyRatesData.companyHourlyRates[0].hourlyRates,
        ),
      );
    }
  }, [hourlyRatesData]);

  useEffect(() => {
    // series 데이터가 있을 때 로딩 상태를 false로 설정
    if (series.length > 0 && series[0].data.length === xAxisDataLength) {
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
        <LineChart
          height={350}
          colors={['#0EA5FF']}
          categories={_.range(0, series[0]?.data.length)}
          annotations={{
            xaxis: peakStatusMap.xaxis,
          }}
          series={series}
        />
      )}
    </>
  );
};
export default TodayPeakManagementContentsWrapper;
