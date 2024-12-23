import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import CurrentMonthBillStatusContentsWrapper from '../ContentsWrapper/CurrentMonthBillStatusContentsWrapper';
import CurrentMonthBillStatusSummaryContentsWrapper from '../ContentsWrapper/CurrentMonthBillStatusSummaryContentsWrapper';
import PastBillStatusHistoryContentsWrapper from '../ContentsWrapper/PastBillStatusHistoryContentsWrapper';
import { useRecoilValue } from 'recoil';
import moment from 'moment';
import PastBillStatusHistoryDetailsContentsWrapper from '../ContentsWrapper/PastBillStatusHistoryDetailsContentsWrapper';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const Billing = () => {
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const currentDate = getCurrentDate(usableLanguages);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [searchedData, setSearchedData] = useState<any[]>([]);

  return (
    <>
      <Breadcrumb pageName={t('Billing Overview')} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <Card
          id="currentMonthBillStatus"
          title={`${moment(currentDate).format('YYYY-MM')} ${t('Bill Status')}`}
          size="md"
        >
          <CurrentMonthBillStatusContentsWrapper />
        </Card>
        <Card
          id="currentMonthBillStatusSummary"
          title={`${moment(currentDate).format('YYYY-MM')} ${t('Summary')}`}
          childrenPxUse={false}
          size="sm"
        >
          <CurrentMonthBillStatusSummaryContentsWrapper />
        </Card>
        <Card id="pastBillStatusHistory" titleUse={false} size="lg">
          <PastBillStatusHistoryContentsWrapper
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            setSearchedData={setSearchedData}
          />
        </Card>
        <Card
          id="pastBillStatusHistoryDetails"
          titleUse={false}
          childrenPxUse={false}
          size="lg"
        >
          <PastBillStatusHistoryDetailsContentsWrapper
            selectedDates={selectedDates}
            searchedData={searchedData}
          />
        </Card>
      </div>
    </>
  );
};

export default Billing;
