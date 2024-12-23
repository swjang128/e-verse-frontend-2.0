import { useRecoilValue } from 'recoil';
import MixBarChart from '../../components/Charts/MixBarChart';
import _ from 'lodash';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useEffect, useState } from 'react';
import SeriesIsLoading from '../../components/Charts/SeriesLoading';
import { SeriesType } from '../../types/series';
import {
  getFilteredSeriesValues,
  getNumberOfHoursInDay,
} from '../../initSeries';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';

const TodayIotMonitoringContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useIotHistoryRealtime } = queries();
  const {
    data: iotHistoryRealtimeData,
    error,
    isLoading,
  } = useIotHistoryRealtime(loggedInUser?.companyId || 0);

  const [seriesIsLoading, setSeriesIsLoading] = useState(true);
  const [series, setSeries] = useState<SeriesType[]>([]);
  const xAxisDataLength = getNumberOfHoursInDay();

  const [totalAnomalCount, setTotalAnomalCount] = useState<number>(0);

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

      // 최근 이상 발생 COUNT = iotHistoryList를 sort후 제일 최근 ERROR COUNT
      setTotalAnomalCount(
        iotHistoryRealtimeData.iotHistoryList.length > 0
          ? iotHistoryRealtimeData.iotHistoryList.sort(
              (a: any, b: any) =>
                new Date(b.referenceTime).getHours() -
                new Date(a.referenceTime).getHours(),
            )[0].iotStatus.ERROR || 0
          : 0,
      );
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
      <div>
        {seriesIsLoading ? (
          <SeriesIsLoading />
        ) : (
          <MixBarChart
            height={350}
            colors={['#3C50E0', '#ff0000']}
            categories={_.range(0, series[0]?.data.length)}
            series={series}
          />
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <svg
            width="15"
            height="13"
            viewBox="0 0 15 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.7585 12.103L14.7596 12.1023L14.7348 12.0594C14.7226 12.0365 14.7108 12.0135 14.6962 11.9924L7.96537 0.333951C7.85625 0.135902 7.6482 0 7.40587 0C7.14335 0 6.91815 0.158404 6.81922 0.384491L6.8185 0.384134L0.14001 11.9521L0.146439 11.9558C0.0523264 12.0691 0.000554925 12.2116 0 12.3589C-2.63767e-08 12.5289 0.0674968 12.6919 0.187652 12.8121C0.307807 12.9323 0.470786 12.9999 0.640758 13H14.1715C14.3415 13 14.5045 12.9324 14.6247 12.8122C14.7449 12.692 14.8124 12.529 14.8124 12.3591C14.8124 12.2678 14.7928 12.1816 14.7585 12.103ZM7.41247 11.7892C6.89922 11.7892 6.48366 11.3861 6.48366 10.8731C6.48366 10.3598 6.89904 9.94443 7.41247 9.94443C7.91304 9.94443 8.32861 10.3596 8.32861 10.8731C8.32877 10.9934 8.30519 11.1126 8.25921 11.2239C8.21322 11.3351 8.14575 11.4361 8.06064 11.5212C7.97554 11.6063 7.87448 11.6738 7.76326 11.7198C7.65203 11.7658 7.53283 11.7894 7.41247 11.7892ZM8.32861 3.6874V8.74114H8.32825L8.32861 8.74399C8.32861 8.95347 8.15895 9.11795 7.95465 9.11795L7.95215 9.11777L6.86404 9.11795C6.65439 9.11795 6.48491 8.95347 6.48491 8.74399L6.48527 8.74114H6.48491V3.70097C6.48473 3.69632 6.48348 3.69186 6.48348 3.68722C6.48348 3.48774 6.63796 3.33076 6.82904 3.31612V3.31326H7.95197C8.15717 3.31451 8.32236 3.47363 8.32754 3.67757H8.32843L8.32861 3.6874Z"
              fill="#80CAEE"
            />
          </svg>
          <span className="text-xs">
            {t('Number of recent abnormalities')} : {totalAnomalCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            width="15"
            height="13"
            viewBox="0 0 15 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.80169 10.4481C6.87401 10.5206 6.93139 10.6067 6.97054 10.7015C7.00969 10.7963 7.02985 10.8979 7.02985 11.0006C7.02985 11.1033 7.00969 11.2049 6.97054 11.2997C6.93139 11.3945 6.87401 11.4806 6.80169 11.5531L6.47072 11.8859C6.11938 12.2405 5.70162 12.5215 5.24159 12.7127C4.78156 12.904 4.28839 13.0016 3.79061 13C3.04096 13.0002 2.30808 12.7769 1.6847 12.3582C1.06131 11.9396 0.57543 11.3444 0.28852 10.648C0.0016098 9.95162 -0.0734348 9.18531 0.0728803 8.44603C0.219195 7.70675 0.580295 7.02771 1.1105 6.49483L3.35685 4.2361C3.83465 3.75574 4.43146 3.41252 5.08549 3.24197C5.73951 3.07142 6.42699 3.07975 7.07674 3.26608C7.72649 3.45242 8.31491 3.80999 8.78106 4.30178C9.24722 4.79358 9.57418 5.40171 9.72809 6.06324C9.75358 6.16382 9.75885 6.26851 9.74359 6.37116C9.72833 6.47382 9.69285 6.57238 9.63922 6.66107C9.58559 6.74976 9.5149 6.82679 9.43128 6.88766C9.34766 6.94853 9.2528 6.992 9.15226 7.01553C9.05173 7.03906 8.94753 7.04218 8.84577 7.0247C8.74402 7.00722 8.64676 6.9695 8.55969 6.91374C8.47262 6.85798 8.3975 6.78531 8.33872 6.69999C8.27994 6.61466 8.23869 6.5184 8.21738 6.41684C8.12605 6.02634 7.93265 5.66746 7.65718 5.37729C7.38171 5.08712 7.03416 4.8762 6.65046 4.76632C6.26676 4.65645 5.86085 4.65162 5.47467 4.75232C5.0885 4.85303 4.73608 5.05562 4.45385 5.33914L2.20749 7.59788C1.89437 7.91247 1.68106 8.31337 1.59453 8.74987C1.50801 9.18637 1.55217 9.63887 1.72142 10.0501C1.89067 10.4614 2.17742 10.813 2.54538 11.0604C2.91335 11.3077 3.34602 11.4399 3.78867 11.44C4.08278 11.4409 4.37415 11.3831 4.64589 11.2699C4.91764 11.1568 5.16436 10.9906 5.37178 10.7809L5.70211 10.4481C5.77419 10.3753 5.85986 10.3175 5.95421 10.2781C6.04856 10.2387 6.14973 10.2184 6.2519 10.2184C6.35407 10.2184 6.45524 10.2387 6.54959 10.2781C6.64394 10.3175 6.72961 10.3753 6.80169 10.4481ZM13.8898 1.11613C13.1789 0.401471 12.2147 0 11.2094 0C10.2041 0 9.23994 0.401471 8.52896 1.11613L8.19863 1.44828C8.05291 1.59481 7.97104 1.79355 7.97104 2.00077C7.97104 2.208 8.05291 2.40674 8.19863 2.55327C8.34436 2.6998 8.54201 2.78212 8.7481 2.78212C8.95419 2.78212 9.15184 2.6998 9.29757 2.55327L9.62854 2.22047C10.0486 1.79812 10.6183 1.56084 11.2123 1.56084C11.8063 1.56084 12.376 1.79812 12.7961 2.22047C13.2161 2.64282 13.4521 3.21566 13.4521 3.81296C13.4521 4.41026 13.2161 4.98309 12.7961 5.40544L10.5458 7.66092C10.3384 7.8706 10.0917 8.03681 9.81994 8.14995C9.5482 8.26308 9.25683 8.32089 8.96272 8.32002C8.45817 8.31966 7.96855 8.14793 7.57324 7.83268C7.17793 7.51743 6.90013 7.07715 6.78488 6.58323C6.73825 6.38171 6.61391 6.20707 6.43922 6.09773C6.26453 5.98838 6.05379 5.9533 5.85337 6.00019C5.65296 6.04708 5.47927 6.1721 5.37053 6.34776C5.26178 6.52341 5.22689 6.73531 5.27352 6.93683C5.46817 7.77329 5.93813 8.51911 6.60718 9.05334C7.27623 9.58756 8.10514 9.87887 8.95949 9.88001H8.96272C9.46074 9.88138 9.95409 9.78345 10.4142 9.59189C10.8744 9.40032 11.2922 9.11892 11.6435 8.76397L13.8898 6.50523C14.2418 6.15141 14.521 5.73133 14.7115 5.269C14.902 4.80666 15 4.31112 15 3.81068C15 3.31024 14.902 2.8147 14.7115 2.35237C14.521 1.89003 14.2418 1.46996 13.8898 1.11613Z"
              fill="#80CAEE"
            />
          </svg>
          <span className="text-xs">{t('Association status')} : NORMAL</span>
        </div>
      </div>
    </>
  );
};

export default TodayIotMonitoringContentsWrapper;
