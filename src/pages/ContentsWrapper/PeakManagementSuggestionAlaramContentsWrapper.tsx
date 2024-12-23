import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useEffect, useState } from 'react';
import { fetchData } from '../../api';
import moment from 'moment';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const PeakManagementSuggestionAlaramContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const currentDate = getCurrentDate(usableLanguages);
  const [alarmList, setAlarmList] = useState<any>([]);

  useEffect(() => {
    const getCurrentDateAlaramData = async () => {
      try {
        const response = await fetchData(
          `/alarm/${loggedInUser?.companyId}?type=AI_PREDICTION_BILL_EXCEEDED&startDateTime=${currentDate}T00:00:00&endDateTime=${currentDate}T23:59:59`,
        );
        setAlarmList(response.data.alarmList);
      } catch (error) {
        console.error('Error while logging in:', error);
        // 에러 처리
      }
    };
    getCurrentDateAlaramData();
  }, []);

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
              {t('No Alarms Have Been Received.')}
            </p>
          </li>
        )}
      </ul>
    </div>
  );
};
export default PeakManagementSuggestionAlaramContentsWrapper;
