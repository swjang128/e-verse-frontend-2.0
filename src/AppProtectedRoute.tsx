import { Navigate, useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { loggedInUserState } from './store/loggedInUserAtom';
import { usableMenusState } from './store/usableMenusAtom';
import { useEffect, useState } from 'react';
import queries from './hooks/queries/queries';
import { getCurrentDate } from './hooks/getStringedDate';
import { usableLanguagesState } from './store/usableLanguagesAtom';
import { E_ROLE_TYPES, E_SUBSCRIPTION_STATUS_TYPES } from './enum';
import { getAccessTokenCookie } from './cookies';
import Loader from './common/Loader';
import { onRenewingState } from './store/onRenewingAtom';
import CoverLoader from './common/Loader/CoverLoader';

function AppProtectedRoute({ children }: { children: JSX.Element }) {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const onRenewing = useRecoilValue(onRenewingState);

  const { useSubscription } = queries();
  const { data: subscriptionListData } = useSubscription(
    loggedInUser?.companyId || 0,
  );

  const isAuthenticated = !!loggedInUser;

  // 로그인 또는 가입 페이지는 인증된 사용자에게 접근 금지
  const noAuthRoutes = ['/auth/login', '/auth/signup'];

  const checkSubscribed = () => {
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
        // setIsSubscribed(E_SUBSCRIPTION_STATUS_TYPES.SUBSCRIBED); // 구독중
        return E_SUBSCRIPTION_STATUS_TYPES.SUBSCRIBED;
      } else if (
        subscriptionListData[0].endDate === getCurrentDate(usableLanguages)
      ) {
        // setIsSubscribed(E_SUBSCRIPTION_STATUS_TYPES.CANCELED); // 당일 구독취소 : Canceled
        return E_SUBSCRIPTION_STATUS_TYPES.CANCELED;
      }
    } else {
      // setIsSubscribed(E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED); // 구독취소 완료
      return E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED;
    }
  };

  const checkAccess = (role: string, parentPath: string) => {
    const baseRouteAccessConfig: any = {
      [E_ROLE_TYPES.USER]: {
        ai: false,
        management: false,
      },
      [E_ROLE_TYPES.MANAGER]: {
        ai: false,
        management: true,
      },
      [E_ROLE_TYPES.ADMIN]: {
        ai: true,
        management: true,
      },
    };

    const hasAccess = baseRouteAccessConfig[role][parentPath];
    if (role === E_ROLE_TYPES.MANAGER && parentPath === 'ai') {
      return checkSubscribed() !== E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED;
    }
    if (role === E_ROLE_TYPES.MANAGER && parentPath === 'management') {
      return location.pathname !== '/management/company' && hasAccess;
    }
    if (role === E_ROLE_TYPES.ADMIN && parentPath === 'management') {
      return location.pathname !== '/management/usage-history' && hasAccess;
    }
    return hasAccess; // 기본 접근 권한 반환
  };

  if (
    isAuthenticated &&
    !noAuthRoutes.includes(location.pathname) &&
    subscriptionListData
  ) {
    if (
      location.pathname.includes('/ai') ||
      location.pathname.includes('/management')
    ) {
      const parentPath = location.pathname.split('/')[1];
      const isAccess = checkAccess(loggedInUser.role, parentPath);
      return isAccess ? children : <Navigate to="/main" replace />;
    }
    return children;
  } else {
    return <CoverLoader originView={children} condition={onRenewing} />;
  }
}

export default AppProtectedRoute;
