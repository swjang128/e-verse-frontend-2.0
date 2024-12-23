import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import CurrentMonthEnergyUsageContentsWrapper from '../ContentsWrapper/CurrentMonthEnergyUsageContentsWrapper';
import CurrentMonthEnergyUsageSummaryContentsWrapper from '../ContentsWrapper/CurrentMonthEnergyUsageSummaryContentsWrapper';
import PastEnergyUsageHistoryContentsWrapper from '../ContentsWrapper/PastEnergyUsageHistoryContentsWrapper';
import { useRecoilValue } from 'recoil';
import moment from 'moment';
import PastEnergyUsageHistoryDetailsContentsWrapper from '../ContentsWrapper/PastEnergyUsageHistoryDetailsContentsWrapper';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const Usage = () => {
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const currentDate = getCurrentDate(usableLanguages);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [searchedData, setSearchedData] = useState<any[]>([]);

  return (
    <>
      <Breadcrumb pageName={t('Energy Usage')} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <Card
          id="currentMonthEnergyUsage"
          title={`${moment(currentDate).format('YYYY-MM')} ${t('Energy Usage')}`}
          size="md"
        >
          <CurrentMonthEnergyUsageContentsWrapper />
        </Card>
        <Card
          id="currentMonthEnergyUsageSummary"
          title={`${moment(currentDate).format('YYYY-MM')} ${t('Summary')}`}
          childrenPxUse={false}
          size="sm"
        >
          <CurrentMonthEnergyUsageSummaryContentsWrapper />
        </Card>
        <Card id="pastEnergyUsageHistory" titleUse={false} size="lg">
          <PastEnergyUsageHistoryContentsWrapper
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            setSearchedData={setSearchedData}
          />
        </Card>
        <Card
          id="pastEnergyUsageHistoryDetails"
          titleUse={false}
          childrenPxUse={false}
          size="lg"
        >
          <PastEnergyUsageHistoryDetailsContentsWrapper
            selectedDates={selectedDates}
            searchedData={searchedData}
          />
        </Card>
      </div>
    </>
  );
};

export default Usage;
