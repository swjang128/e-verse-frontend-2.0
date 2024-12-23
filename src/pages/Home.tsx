import React, { useEffect, useState } from 'react';
import Card from '../components/Card/Card';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import MainMonitoringCard from '../components/Card/MainMonitoringCard';
import MonthlyComparisionEnergyContentsWrapper from './ContentsWrapper/MonthlyComparisionEnergyContentsWrapper';
import TodayIotMonitoringContentsWrapper from './ContentsWrapper/TodayIotMonitoringContentsWrapper';
import MonthlyComparisionBillContentsWrapper from './ContentsWrapper/MonthlyComparisionBillContentsWrapper';
import { t } from 'i18next';
import Chatbot from './Chatbot';
import queries from '../hooks/queries/queries';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../store/loggedInUserAtom';
import { E_ROLE_TYPES, E_SUBSCRIPTION_STATUS_TYPES } from '../enum';
import { getCurrentDate } from '../hooks/getStringedDate';
import { usableLanguagesState } from '../store/usableLanguagesAtom';

const Home: React.FC = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const { useSubscription } = queries();
  const { data: subscriptionListData } = useSubscription(
    loggedInUser?.companyId || 0,
  );

  // 구독 여부
  // true false 만으로는 처리할 수 없는 부분이 있어 (당일 구독취소 flag) string으로 변경
  // subscribed = 구독중, canceled = (당일 구독취소)구독취소중, unsubscribed = 구독취소 완료
  // S, C, U
  const [isSubscribed, setIsSubscribed] = useState<E_SUBSCRIPTION_STATUS_TYPES>(
    E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED,
  ); // 기본 U

  // isSubscribed
  useEffect(() => {
    if (
      subscriptionListData &&
      subscriptionListData.length > 0 &&
      subscriptionListData.find(
        (item: any) => item.service === 'AI_ENERGY_USAGE_FORECAST',
      )
    ) {
      subscriptionListData.sort(
        (a: any, b: any) => b.subscriptionId - a.subscriptionId,
      );
      if (subscriptionListData[0].endDate === undefined) {
        setIsSubscribed(E_SUBSCRIPTION_STATUS_TYPES.SUBSCRIBED); // 구독중
      } else if (
        subscriptionListData[0].endDate === getCurrentDate(usableLanguages)
      ) {
        setIsSubscribed(E_SUBSCRIPTION_STATUS_TYPES.CANCELED); // 당일 구독취소 : Canceled
      }
    } else {
      setIsSubscribed(E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED); // 구독취소 완료
    }
  }, [subscriptionListData]);

  return (
    <>
      <div className="relative">
        <Breadcrumb pageName={t('Main')} />

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <MainMonitoringCard />
          <Card
            id="MonthlyComparisionEnergy"
            title={t('Energy Usage Status')}
            size="md"
          >
            <MonthlyComparisionEnergyContentsWrapper />
          </Card>
          <Card id="todayIotMonitoring" title={t('IoT Status')} size="sm">
            <TodayIotMonitoringContentsWrapper />
          </Card>
          <Card id="MonthlyComparisionBill" title={t('Bill Status')} size="md">
            <MonthlyComparisionBillContentsWrapper />
          </Card>
        </div>
        {(loggedInUser?.role === E_ROLE_TYPES.ADMIN ||
          (loggedInUser?.role === E_ROLE_TYPES.MANAGER &&
            isSubscribed !== E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED)) && (
          <Chatbot />
        )}
      </div>
    </>
  );
};

export default Home;
