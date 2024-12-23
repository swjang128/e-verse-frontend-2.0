import { useRecoilValue } from 'recoil';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import LastHourIotSummaryContentsWrapper from '../ContentsWrapper/LastHourIotSummaryContentsWrapper';
import TodayIotStatusContentsWrapper from '../ContentsWrapper/TodayIotStatusContentsWrapper';
import PastIotHistoryContentsWrapper from '../ContentsWrapper/PastIotHistoryContentsWrapper';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const Devices = () => {
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const currentDate = getCurrentDate(usableLanguages);

  return (
    <>
      <Breadcrumb pageName={t('IoT Devices')} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <Card
          id="todayIotStatus"
          title={`${currentDate} ${t('IoT Status')}`}
          size="md"
        >
          <TodayIotStatusContentsWrapper />
        </Card>
        <Card
          id="lastHourIotSummary"
          title={`${currentDate} ${t('Summary')} (${t('Last Hour')})`}
          childrenPxUse={false}
          size="sm"
        >
          <LastHourIotSummaryContentsWrapper />
        </Card>
        <Card
          id="pastIotHistory"
          titleUse={false}
          childrenPxUse={false}
          size="lg"
        >
          <PastIotHistoryContentsWrapper />
        </Card>
      </div>
    </>
  );
};

export default Devices;
