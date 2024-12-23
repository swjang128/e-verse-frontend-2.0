import { useEffect, useState } from 'react';
import { fetchData } from '../../api';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import moment from 'moment';
import _ from 'lodash';
import DatepickDataTable from '../../components/Tables/DatepickDataTable';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import {
  getCurrentDate,
  getHarfYearAgoCurrentDate,
} from '../../hooks/getStringedDate';

const PastAnomalyDetectionHistoryContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    const getAnomalyDetectionData = async (dates: string[]): Promise<any[]> => {
      try {
        const response = await fetchData(
          `/alarm/anomaly/${loggedInUser?.companyId}?startDateTime=${dates[0]}T00:00:00&endDateTime=${dates[1] || dates[0]}T23:59:59`,
        );
        return response.data.alarmList.map((item: any) => ({
          ...item,
          createdDate: moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss'),
        }));
      } catch (error) {
        console.error('Error while logging in:', error);
        return [];
        // 에러 처리
      }
    };

    const loadTableData = async () => {
      // 당월 기준 데이타
      if (selectedDates.length > 0) {
        setTableData(await getAnomalyDetectionData(selectedDates));
      }
    };
    loadTableData();
  }, [selectedDates]);

  return (
    <>
      <DatepickDataTable
        title={t('Past Anomaly Detection History')}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        data={tableData}
        columns={[
          { Header: t('CreatedDate'), accessor: 'createdDate' },
          { Header: t('Type'), accessor: 'type' },
          {
            Header: t('Message'),
            accessor: 'message',
          },
          {
            Header: t('Priority'),
            accessor: 'priority',
          },
        ]}
        excelReportName="Anomaly_Detection"
        excelDownloadEndpoint={`/report/anomaly/${loggedInUser?.companyId}`}
        datepickerMinDate={getHarfYearAgoCurrentDate(usableLanguages)}
        datepickerMaxDate={getCurrentDate(usableLanguages)}
      />
    </>
  );
};

export default PastAnomalyDetectionHistoryContentsWrapper;
