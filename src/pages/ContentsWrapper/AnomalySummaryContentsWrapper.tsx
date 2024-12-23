import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import FacilityIcon from '../../path/FacilityIcon';
import _ from 'lodash';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';
import { E_PRIORITY_TYPES } from '../../enum';

const AnomalySummaryContentsWrapper: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const currentDate = getCurrentDate(usableLanguages);
  const { useAlarmAnomalyWithDates } = queries();
  const {
    data: alarmAnomalyWithDatesData,
    error,
    isLoading,
  } = useAlarmAnomalyWithDates(
    loggedInUser?.companyId || 0,
    `${currentDate}T00:00:00`,
    `${currentDate}T23:59:59`,
  );

  const [sumHigh, setSumHigh] = useState<string>();
  const [sumMiddle, setSumMiddle] = useState<string>();
  const [sumLow, setSumLow] = useState<string>();

  useEffect(() => {
    if (alarmAnomalyWithDatesData) {
      setSumHigh(
        alarmAnomalyWithDatesData.alarmList
          .filter((alarm: any) => alarm.priority === E_PRIORITY_TYPES.HIGH)
          .length.toLocaleString('en-US'),
      );
      setSumMiddle(
        alarmAnomalyWithDatesData.alarmList
          .filter((alarm: any) => alarm.priority === E_PRIORITY_TYPES.MIDDLE)
          .length.toLocaleString('en-US'),
      );
      setSumLow(
        alarmAnomalyWithDatesData.alarmList
          .filter((alarm: any) => alarm.priority === E_PRIORITY_TYPES.LOW)
          .length.toLocaleString('en-US'),
      );
    }
  }, [alarmAnomalyWithDatesData]);

  return (
    <>
      {/* 전력 사용량*/}
      <div className="border-gray-400 flex flex-1 items-center justify-between border-y border-stroke px-7">
        <div className="flex gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500">
            <FacilityIcon />
          </span>
          <div>
            <span className="block text-lg font-semibold text-black dark:text-white">
              {t('High')}
            </span>
            <span className="block text-miniTitle-sm font-semibold">
              OCI AI
            </span>
          </div>
        </div>
        <span className="font-semibold text-black dark:text-white">
          {sumHigh || 0} {t('alerts')}
        </span>
      </div>

      {/* 예측 사용량*/}
      <div className="border-gray-400 flex flex-1 items-center justify-between border-b border-stroke px-7">
        <div className="flex gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
            <FacilityIcon />
          </span>
          <div>
            <span className="block text-lg font-semibold text-black dark:text-white">
              {t('Middle')}
            </span>
            <span className="block text-miniTitle-sm font-semibold">
              OCI AI
            </span>
          </div>
        </div>
        <span className="font-semibold text-black dark:text-white">
          {sumMiddle || 0} {t('alerts')}
        </span>
      </div>

      {/* AI 예측 정확도 */}
      <div className="border-gray-400 flex flex-1 items-center justify-between px-7">
        <div className="flex gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
            <FacilityIcon />
          </span>
          <div>
            <span className="block text-lg font-semibold text-black dark:text-white">
              {t('Low')}
            </span>
            <span className="block text-miniTitle-sm font-semibold">
              OCI AI
            </span>
          </div>
        </div>
        <span className="font-semibold text-black dark:text-white">
          {sumLow || 0} {t('alerts')}
        </span>
      </div>
    </>
  );
};

export default AnomalySummaryContentsWrapper;
