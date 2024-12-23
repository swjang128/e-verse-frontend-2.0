import { useEffect, useState } from 'react';
import DataTable from '../../components/Tables/DataTable';
import moment from 'moment';
import _ from 'lodash';
import { t } from 'i18next';

interface PastBillStatusHistoryDetailsContentsWrapperProps {
  selectedDates: string[];
  searchedData: any[];
}

const PastBillStatusHistoryDetailsContentsWrapper: React.FC<
  PastBillStatusHistoryDetailsContentsWrapperProps
> = ({ selectedDates, searchedData }) => {
  const [tableData, setTableData] = useState<any[]>([]);
  useEffect(() => {
    const loadTableData = async () => {
      // prop으로 전달받은 PastBillStatusHistory 데이타
      const getSeachedPastData = async (): Promise<any[]> => {
        try {
          return _.flatMap(searchedData, (month: any) => {
            return _.flatMap(month.dailyResponse, (entry: any) => {
              return _.map(entry.hourlyResponse, (hourlyEntry: any) => {
                return {
                  referenceTime: moment(hourlyEntry.referenceTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                  ),
                  bill: `${Math.round(hourlyEntry.bill).toLocaleString('en-US')} $`,
                  forecastBill: `${Math.round(hourlyEntry.forecastBill).toLocaleString('en-US')} $`,
                  actualAndForecastBillDifference: `${Math.round(hourlyEntry.actualAndForecastBillDifference).toLocaleString('en-US')} $`,
                  deviationRate: `${hourlyEntry.deviationRate.toFixed(2)} %`,
                };
              });
            });
          });
        } catch (error) {
          console.error('Error while logging in:', error);
          return [];
          // 에러 처리
        }
      };

      if (selectedDates.length > 0) {
        const chartData = await getSeachedPastData(); // 함수 호출
        setTableData(chartData);
      }
    };
    loadTableData();
  }, [selectedDates, searchedData]);

  return (
    <>
      <DataTable
        title={t('Past Bill Status History Details')}
        data={tableData}
        columns={[
          { Header: t('ReferenceTime'), accessor: 'referenceTime' },
          { Header: t('Bill'), accessor: 'bill' },
          {
            Header: t('ForecastBill'),
            accessor: 'forecastBill',
          },
          {
            Header: t('ActualAndForecastBillDifference'),
            accessor: 'actualAndForecastBillDifference',
          },
          { Header: t('DeviationRate'), accessor: 'deviationRate' },
        ]}
      />
    </>
  );
};

export default PastBillStatusHistoryDetailsContentsWrapper;
