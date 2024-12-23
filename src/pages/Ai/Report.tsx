import { useRecoilValue } from 'recoil';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import CurrentMonthTotalContentsWrapper from '../ContentsWrapper/CurrentMonthTotalContentsWrapper';
import moment from 'moment';
import CurrentMonthTotalSummaryContentsWrapper from '../ContentsWrapper/CurrentMonthTotalSummaryContentsWrapper';
import PastTotalHistoryContentsWrapper from '../ContentsWrapper/PastTotalHistoryContentsWrapper';
import PastTotalHistoryDetailsContentsWrapper from '../ContentsWrapper/PastTotalHistoryDetailsContentsWrapper';
import { useState } from 'react';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const Report = () => {
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const currentDate = getCurrentDate(usableLanguages);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [searchedData, setSearchedData] = useState<any[]>([]);

  return (
    <>
      <Breadcrumb pageName={t('Saving Report')} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <Card
          id="currentMonthTotal"
          title={`${moment(currentDate).format('YYYY-MM')} ${t('Total Report')}`}
          size="md"
        >
          <CurrentMonthTotalContentsWrapper />
        </Card>
        <Card
          id="currentMonthTotalSummary"
          title={`${moment(currentDate).format('YYYY-MM')} ${t('Total Summary')}`}
          size="sm"
          childrenPxUse={false}
        >
          <CurrentMonthTotalSummaryContentsWrapper />
        </Card>
        <Card id="pastTotalHistory" titleUse={false} size="lg">
          <PastTotalHistoryContentsWrapper
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            setSearchedData={setSearchedData}
          />
        </Card>
        <Card
          id="pastTotalHistoryDetails"
          titleUse={false}
          size="lg"
          childrenPxUse={false}
        >
          <PastTotalHistoryDetailsContentsWrapper
            selectedDates={selectedDates}
            searchedData={searchedData}
          />
        </Card>
      </div>
    </>
  );
};

export default Report;
