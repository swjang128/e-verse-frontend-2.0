import { useEffect, useState } from 'react';
import DataTable from '../../components/Tables/DataTable';
import moment from 'moment';
import _ from 'lodash';
import { t } from 'i18next';

interface PastEnergyUsageHistoryDetailsContentsWrapperProps {
  selectedDates: string[];
  searchedData: any[];
}

const PastEnergyUsageHistoryDetailsContentsWrapper: React.FC<
  PastEnergyUsageHistoryDetailsContentsWrapperProps
> = ({ selectedDates, searchedData }) => {
  const [tableData, setTableData] = useState<any[]>([]);
  useEffect(() => {
    const loadTableData = async () => {
      // prop으로 전달받은 PastEnergyUsageHistory 데이타
      const getSeachedPastData = async (): Promise<any[]> => {
        try {
          return _.flatMap(searchedData, (month: any) => {
            return _.flatMap(month.dailyResponse, (entry: any) => {
              return _.map(entry.hourlyResponse, (hourlyEntry: any) => {
                return {
                  referenceTime: moment(hourlyEntry.referenceTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                  ),
                  usage: `${Math.round(hourlyEntry.usage).toLocaleString('en-US')} kwh`,
                  forecastUsage: `${Math.round(hourlyEntry.forecastUsage).toLocaleString('en-US')} kwh`,
                  actualAndForecastUsageDifference: `${Math.round(hourlyEntry.actualAndForecastUsageDifference).toLocaleString('en-US')} kwh`,
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
        title={t('Past Energy Usage History Details')}
        data={tableData}
        columns={[
          { Header: t('ReferenceTime'), accessor: 'referenceTime' },
          { Header: t('Usage'), accessor: 'usage' },
          {
            Header: t('ForecastUsage'),
            accessor: 'forecastUsage',
          },
          {
            Header: t('ActualAndForecastUsageDifference'),
            accessor: 'actualAndForecastUsageDifference',
          },
          { Header: t('DeviationRate'), accessor: 'deviationRate' },
        ]}
      />
    </>
  );
};

export default PastEnergyUsageHistoryDetailsContentsWrapper;
