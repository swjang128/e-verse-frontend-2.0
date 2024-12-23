import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useEffect, useState } from 'react';
import moment from 'moment';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const AnomalyDetectionAlaramContentsWrapper = () => {
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
  const [alarmList, setAlarmList] = useState<any>([]);

  useEffect(() => {
    if (alarmAnomalyWithDatesData) {
      setAlarmList(alarmAnomalyWithDatesData.alarmList);
    }
  }, [alarmAnomalyWithDatesData]);

  return (
    <div className="h-90 overflow-y-auto">
      <ul>
        {alarmList.length > 0 ? (
          alarmList.map((alarms: any) => {
            return (
              <li key={alarms.alarmId}>
                <div className="grid min-h-25 items-center border-t border-stroke px-7 py-2 text-sm">
                  <p className="text-left font-semibold text-red-600">
                    {alarms.message}
                  </p>
                  <p className="text-right">
                    {moment(alarms.createdDate).format('YYYY-MM-DD HH:mm:ss')}
                  </p>
                </div>
              </li>
            );
          })
        ) : (
          <li>
            <p className="grid min-h-25 border-t border-stroke px-7 py-2 text-left">
              {t('No Detections Have Been Received.')}
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};
export default AnomalyDetectionAlaramContentsWrapper;
