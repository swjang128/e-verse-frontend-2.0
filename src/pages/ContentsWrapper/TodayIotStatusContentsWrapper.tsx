import { useEffect, useState } from 'react';
import DoubleBarChart from '../../components/Charts/DoubleBarChart';
import SeriesIsLoading from '../../components/Charts/SeriesLoading';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { SeriesType } from '../../types/series';
import _ from 'lodash';
import {
  getFilteredSeriesValues,
  getNumberOfHoursInDay,
} from '../../initSeries';
import queries from '../../hooks/queries/queries';

const TodayIotStatusContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useIotHistoryRealtime } = queries();
  const {
    data: iotHistoryRealtimeData,
    error,
    isLoading,
  } = useIotHistoryRealtime(loggedInUser?.companyId || 0);

  const [seriesIsLoading, setSeriesIsLoading] = useState(false);
  const [series, setSeries] = useState<SeriesType[]>([]);
  const xAxisDataLength = getNumberOfHoursInDay();

  useEffect(() => {
    if (iotHistoryRealtimeData) {
      setSeries([
        {
          name: 'NORMAL',
          data: getFilteredSeriesValues({
            type: 'hour',
            element: iotHistoryRealtimeData.iotHistoryList,
            typedValue: '',
            filterKey: 'referenceTime',
            valueKey: 'iotStatus.NORMAL',
          }),
        },
        {
          name: 'ERROR',
          data: getFilteredSeriesValues({
            type: 'hour',
            element: iotHistoryRealtimeData.iotHistoryList,
            typedValue: '',
            filterKey: 'referenceTime',
            valueKey: 'iotStatus.ERROR',
          }),
        },
      ]);
    }
  }, [iotHistoryRealtimeData]);

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

export default TodayIotStatusContentsWrapper;
