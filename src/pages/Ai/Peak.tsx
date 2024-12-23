import { useRecoilValue } from 'recoil';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import HourlyBillRatesByCountryContentsWrapper from '../ContentsWrapper/HourlyBillRatesByCountryContentsWrapper';
import PeakManagementSuggestionAlaramContentsWrapper from '../ContentsWrapper/PeakManagementSuggestionAlaramContentsWrapper';
import TodayPeakManagementContentsWrapper from '../ContentsWrapper/TodayPeakManagementContentsWrapper';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const Peak = () => {
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const currentDate = getCurrentDate(usableLanguages);

  return (
    <>
      <Breadcrumb pageName={t('Peak Management')} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <Card
          id="currentDatePeakManagement"
          title={`${currentDate} ${t('Peak Management')}`}
          size="md"
        >
          <TodayPeakManagementContentsWrapper />
        </Card>
        <Card
          id="peakManagementSuggestionAlaram"
          title={`${currentDate} ${t('AI Prediction Suggestion Alarm')}`}
          size="sm"
          childrenPxUse={false}
        >
          <PeakManagementSuggestionAlaramContentsWrapper />
        </Card>
        <Card
          id="hourlyBillRatesByCountry"
          title={t('Hourly Bill Rates By Country')}
          size="lg"
        >
          <HourlyBillRatesByCountryContentsWrapper />
        </Card>
      </div>
    </>
  );
};

export default Peak;
