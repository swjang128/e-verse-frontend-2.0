import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { fetchData } from '../../api';
import _ from 'lodash';
import moment from 'moment';
import DatepickDataTable from '../../components/Tables/DatepickDataTable';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import {
  getCurrentDate,
  getHarfYearAgoCurrentDate,
} from '../../hooks/getStringedDate';
import { useQueryClient } from '@tanstack/react-query';

const PastIotHistoryContentsWrapper: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const queryClient = useQueryClient();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  useEffect(() => {
    // 검색된 PastIotHistory 데이타
    const getSearchedPastData = async (dates: string[]): Promise<any[]> => {
      try {
        const response = await fetchData(
          `/iot/history/${loggedInUser?.companyId}?startDate=${dates[0]}&endDate=${dates[1] || dates[0]}`,
        );
        return response.data.iotHistoryList.map((item: any) => ({
          ...item,
          createdDate: moment(item.createdDate).format('YYYY-MM-DD HH:mm:ss'),
        }));
      } catch (error) {
        console.error('Error while logging in:', error);
        return [];
        // 에러 처리
      } finally {
        // 유료 API 이므로 Main의 API Call Count를 갱신키 위해 invalidate한다.
        queryClient.invalidateQueries({
          queryKey: [
            'apiCallLogWithDate',
            loggedInUser?.companyId,
            getCurrentDate(usableLanguages),
          ],
        });
      }
    };

    const loadTableData = async () => {
      // 당월 기준 데이타
      if (selectedDates.length > 0) {
        setTableData(await getSearchedPastData(selectedDates));
      }
    };
    loadTableData();
  }, [selectedDates]);

  return (
    <div>
      <DatepickDataTable
        title={t('Past IoT History')}
        selectedDates={selectedDates}
        setSelectedDates={setSelectedDates}
        data={tableData}
        columns={[
          { Header: t('Date'), accessor: 'createdDate' },
          {
            Header: t('SerialNumber'),
            accessor: 'serialNumber',
          },
          {
            Header: t('Type'),
            accessor: 'type',
          },
          { Header: t('Location'), accessor: 'location' },
          { Header: t('Status'), accessor: 'status' },
        ]}
        excelReportName="Iot_Devices"
        excelDownloadEndpoint={`/report/iot-history/${loggedInUser?.companyId}`}
        datepickerMinDate={getHarfYearAgoCurrentDate(usableLanguages)}
        datepickerMaxDate={getCurrentDate(usableLanguages)}
      />
    </div>
  );
};

export default PastIotHistoryContentsWrapper;
