import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import ErrorIcon from '../../path/ErrorIcon';
import AssociationIcon from '../../path/AssociationIcon';
import FacilityIcon from '../../path/FacilityIcon';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';

interface IoTItem {
  iotStatus: IoTStatus;
  referenceTime: string;
}

interface IoTStatus {
  NORMAL?: number;
  ERROR?: number;
  [key: string]: number | undefined; // 다른 상태 값들을 지원
}

const LastHourIotSummaryContentsWrapper: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useIotHistoryRealtime } = queries();
  const {
    data: iotHistoryRealtimeData,
    error,
    isLoading,
  } = useIotHistoryRealtime(loggedInUser?.companyId || 0);

  const [iotStatus, setIotStatus] = useState<IoTItem[] | null>(null);

  useEffect(() => {
    if (iotHistoryRealtimeData) {
      setIotStatus(iotHistoryRealtimeData.iotHistoryList);
    }
  }, [iotHistoryRealtimeData]);

  // 최신 데이터의 iotStatus에서 상태 값을 합산하는 함수
  function getLatestIotStatusSummary(iotStatus: IoTItem[]) {
    if (iotStatus.length === 0) return { total: 0, errorCount: 0 };

    // referenceTime 기준으로 iotHistoryList 정렬 (최신이 맨 앞으로 오도록)
    const sortedIotHistoryList = iotStatus.sort(
      (a, b) =>
        new Date(b.referenceTime).getTime() -
        new Date(a.referenceTime).getTime(),
    );

    // 최신 데이터 가져오기 (배열의 첫 번째 요소)
    const latestIotStatus = sortedIotHistoryList[0].iotStatus;

    const total = (Object.values(latestIotStatus) as number[]).reduce(
      (sum: number, count: number) => sum + count,
      0,
    );

    // ERROR 상태의 개수
    const errorCount = latestIotStatus['ERROR'] || 0;

    return { total, errorCount };
  }

  // getLatestIotStatusSummary 함수를 한 번만 호출
  const latestIotSummary = iotStatus
    ? getLatestIotStatusSummary(iotStatus)
    : { total: 0, errorCount: 0 };

  return (
    <>
      {/* 총 설비 대수 */}
      <div className="border-gray-400 flex flex-1 items-center justify-between border-y border-stroke px-7">
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2">
            <FacilityIcon />
          </span>
          <div>
            <span className="block text-lg font-semibold text-black dark:text-white">
              {t('Facility')}
            </span>
          </div>
        </div>
        <span className="font-semibold text-black dark:text-white">
          {latestIotSummary.total} {t('units')}
        </span>
      </div>

      {/* 가동중지 */}
      <div className="border-gray-400 flex flex-1 items-center justify-between border-b border-stroke px-7">
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2">
            <ErrorIcon />
          </span>
          <span className="block text-lg font-semibold text-black dark:text-white">
            {t('Error')}
          </span>
        </div>
        <span className="font-semibold text-black dark:text-white">
          {latestIotSummary.errorCount} errors
        </span>
      </div>

      {/* 네트워크 연결상태 */}
      <div className="border-gray-400 flex flex-1 items-center justify-between px-7">
        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2">
            <AssociationIcon />
          </span>
          <span className="block text-lg font-semibold text-black dark:text-white">
            {t('Association status')}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold text-black dark:text-white">
            NORMAL
          </span>
        </div>
      </div>
    </>
  );
};

export default LastHourIotSummaryContentsWrapper;
