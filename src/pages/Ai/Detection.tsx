import { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Card from '../../components/Card/Card';
import AnomalyDetectionAlaramContentsWrapper from '../ContentsWrapper/AnomalyDetectionAlaramContentsWrapper';
import AnomalySummaryContentsWrapper from '../ContentsWrapper/AnomalySummaryContentsWrapper';
import PastAnomalyDetectionHistoryContentsWrapper from '../ContentsWrapper/PastAnomalyDetectionHistoryDetailsContentsWrapper';
import AnomalyDetectionDetailsContentsWrapper from '../ContentsWrapper/AnomalyDetectionDetailsContentsWrapper';
import { t } from 'i18next';
import { useRecoilValue } from 'recoil';
import { getCurrentDate } from '../../hooks/getStringedDate';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';

const Detection = () => {
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const currentDate = getCurrentDate(usableLanguages);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Breadcrumb pageName={t('Anomaly Detection')} />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <Card
          id=""
          title={t('AI Anomaly Detection Setting')}
          size="sm"
          childrenPxUse={false}
          buttonArea={
            <button
              onClick={() => setIsModalOpen(true)}
              className="min-w-24 items-center rounded border border-primary bg-transparent px-4 py-2 text-center font-medium text-primary hover:bg-primary hover:bg-opacity-90 hover:text-white dark:bg-primary dark:text-white xsm:max-w-1 md:max-w-40"
            >
              {t('Button.Edit')}
            </button>
          }
        >
          <AnomalyDetectionDetailsContentsWrapper
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </Card>
        <Card
          id=""
          title={`${currentDate} ${t('AI Anomaly Detection Summary')}`}
          size="sm"
          childrenPxUse={false}
        >
          <AnomalySummaryContentsWrapper />
        </Card>
        <Card
          id=""
          title={`${currentDate} ${t('AI Anomaly Detection Alarm')}`}
          size="sm"
          childrenPxUse={false}
        >
          <AnomalyDetectionAlaramContentsWrapper />
        </Card>
        <Card id="" titleUse={false} childrenPxUse={false} size="lg">
          <PastAnomalyDetectionHistoryContentsWrapper />
        </Card>
      </div>
    </>
  );
};

export default Detection;
