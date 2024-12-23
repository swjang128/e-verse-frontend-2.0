import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { getCurrentDate, getCurrentDateDetails } from '../getStringedDate';
import { UsableLanguagesType } from '../../store/usableLanguagesAtom';
import { E_ROLE_TYPES } from '../../enum';
import { axiosClient } from '../../AxiosClientProvider';

// GET (Fetching 성 API) 관리
const queries = () => {
  // /auth/info
  // 개인정보가 너무 많아 보안 취약하므로 미 사용
  // const useAuthInfo = () => {
  //   return useQuery({
  //     queryKey: ['authInfo'] as const,
  //     queryFn: async () =>
  //       await axiosClient
  //         .get(`/auth/info`)
  //         .then((response) => response.data.data),
  //     staleTime: 3600000, // 1시간
  //     refetchInterval: 3600000, // 1시간
  //   });
  // };

  // /auth/role
  const useAuthRoleInfo = () => {
    return useQuery({
      queryKey: ['authRoleInfo'] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/auth/role`)
          .then((response) => response.data.data),
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /company/info
  const useAuthCompanyInfo = () => {
    return useQuery({
      queryKey: ['authCompanyInfo'] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/company/info`)
          .then((response) => response.data.data),
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /country/list
  const useCountryList = () => {
    return useQuery({
      queryKey: ['countryList'] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/country/list`)
          .then((response) => response.data.data),
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /menu
  const useMenuList = () => {
    return useQuery({
      queryKey: ['menuList'] as const,
      queryFn: async () =>
        await axiosClient.get(`/menu`).then((response) => {
          const res = response.data.data;
          return res.map((resData: any) => {
            return {
              menuId: resData.menuId,
              name: resData.name,
              url: resData.url,
              parentId: resData.parentId,
              children:
                resData.children &&
                resData.children
                  .map((resChildren: any) => {
                    return {
                      menuId: resChildren.menuId,
                      name: resChildren.name,
                      url: resChildren.url,
                      parentId: resChildren.parentId,
                    };
                  })
                  .sort((a: any, b: any) => a.menuId - b.menuId),
            };
          });
        }),
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /company/list
  const useCompanyList = () => {
    return useQuery({
      queryKey: ['companyList'] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/company/list`)
          .then((response) => response.data.data.companyList),
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /alarm - 시스템 알람 (notification)
  // 10초 Polling
  const useSystemNotificationList = (
    companyId: number,
    usableLanguages: UsableLanguagesType,
  ) => {
    const currentDateDetails = getCurrentDateDetails(usableLanguages);
    const startDateTime = `${currentDateDetails.date.fullDate}T00:00:00`;
    const endDateTime = `${currentDateDetails.date.fullDate}T23:59:59`;
    return useQuery({
      queryKey: ['systemNotificationList'] as const,
      queryFn: async () =>
        await axiosClient
          .get(
            `/alarm/${companyId}?startDateTime=${startDateTime}&endDateTime=${endDateTime}&type=MAXIMUM_ENERGY_USAGE,MINIMUM_ENERGY_USAGE`,
          )
          .then((response) => response.data.data.alarmList),
      staleTime: 10000, // 10초
      refetchInterval: 10000, // 10초
    });
  };

  // /country - management용
  const useManageCountryList = () => {
    return useQuery({
      queryKey: ['manageCountryList'] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/country`)
          .then((response) => response.data.data.countryList),
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /company - management용
  const useManageCompanyList = () => {
    return useQuery({
      queryKey: ['manageCompanyList'] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/company`)
          .then((response) => response.data.data.companyList),
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /subscription/{companyId} - 구독 여부 조회
  const useSubscription = (companyId: number) => {
    return useQuery({
      queryKey: ['subscription', companyId] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/subscription/${companyId}`)
          .then((response) => response.data.data.subscriptionList),
      enabled: companyId != 0,
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /member?masking=true => Admin용
  // /member?companyId={companyId}&masking=true => Manager용
  // member List 정보 (masking true)
  const useMemberList = (role: string, companyId: number) => {
    let endpoint = `/member?companyId=${companyId}&masking=true`;
    if (role === E_ROLE_TYPES.ADMIN) {
      endpoint = `/member?masking=true`;
    }
    return useQuery({
      queryKey: ['memberList', companyId] as const,
      queryFn: async () =>
        await axiosClient
          .get(endpoint)
          .then((response) => response.data.data.memberList),
      enabled: companyId != 0 && role != '',
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /member?memberId=${memberId}&masking=false => Admin용
  // /member?companyId={companyId}&memberId={memberId}&masking=false => Manager용
  // member 단일 정보 (masking false)
  const useMemberOneWithoutMasking = (
    role: string,
    companyId: number,
    memberId: number,
  ) => {
    let endpoint = `/member?companyId=${companyId}&memberId=${memberId}&masking=false`;
    if (role === E_ROLE_TYPES.ADMIN) {
      endpoint = `/member?memberId=${memberId}&masking=false`;
    }
    return useQuery({
      queryKey: ['member', companyId, memberId] as const,
      queryFn: async () =>
        await axiosClient
          .get(endpoint)
          .then((response) => response.data.data.memberList),
      enabled: companyId != 0 && role != '',
      staleTime: 3600000, // 1시간
      refetchInterval: 3600000, // 1시간
    });
  };

  // /energy/realtime/{companyId} (Main Dashboard)
  const useEnergyRealtimeForMain = (companyId: number) => {
    return useQuery({
      queryKey: ['energyRealtimeForMain', companyId] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/energy/realtime/${companyId}`)
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /energy/realtime/{companyId}
  const useEnergyRealtime = (companyId: number) => {
    return useQuery({
      queryKey: ['energyRealtime', companyId] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/energy/realtime/${companyId}`)
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /energy/monthly/{companyId}
  const useEnergyMonthly = (companyId: number) => {
    return useQuery({
      queryKey: ['energyMonthly', companyId] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/energy/monthly/${companyId}`)
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /energy/{companyId}?startDate={dates[0]}&endDate={dates[1] || dates[0]},
  const useEnergyWithDates = (companyId: number, dates: string[]) => {
    return useQuery({
      queryKey: ['energyWithDates', companyId, dates] as const,
      queryFn: async () =>
        await axiosClient
          .get(
            `/energy/${companyId}?startDate=${dates[0]}&endDate=${dates[1] || dates[0]}`,
          )
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /iot/history/realtime/{companyId}
  const useIotHistoryRealtime = (companyId: number) => {
    return useQuery({
      queryKey: ['iotHistoryRealtime', companyId] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/iot/history/realtime/${companyId}`)
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /iot/history/{companyId}?startDate={dates[0]}&endDate={dates[1] || dates[0]}
  const useIotHistoryWithDates = (companyId: number, dates: string[]) => {
    return useQuery({
      queryKey: ['iotHistoryWithDates', companyId, dates] as const,
      queryFn: async () =>
        await axiosClient
          .get(
            `/iot/history/${companyId}?startDate=${dates[0]}&endDate=${dates[1] || dates[0]}`,
          )
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /api-call-log/charges/{companyId}?targetDate={currentDate}
  const useApiCallLogWithDate = (companyId: number, targetDate: string) => {
    return useQuery({
      queryKey: ['apiCallLogWithDate', companyId, targetDate] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/api-call-log/charges/${companyId}?targetDate=${targetDate}`)
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /rate/hourly-rates/{companyId}
  const useHourlyRates = (companyId: number) => {
    return useQuery({
      queryKey: ['hourlyRates', companyId] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/rate/hourly-rates/${companyId}`)
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /payment/{companyId}?usageDateStart={startOfCurrentMonth}&usageDateEnd={endOfCurrentMonth}
  const usePaymentWithDates = (
    companyId: number,
    usageDateStart: string,
    usageDateEnd: string,
  ) => {
    return useQuery({
      queryKey: ['paymentWithDates', usageDateStart, usageDateEnd] as const,
      queryFn: async () =>
        await axiosClient
          .get(
            `/payment/${companyId}?usageDateStart=${usageDateStart}&usageDateEnd=${usageDateEnd}`,
          )
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /alarm/anomaly/{companyId}?startDateTime={currentDate}T00:00:00&endDateTime={currentDate}T23:59:59,
  const useAlarmAnomalyWithDates = (
    companyId: number,
    startDate: string,
    endDate: string,
  ) => {
    return useQuery({
      queryKey: [
        'alarmAnomalyWithDates',
        companyId,
        startDate,
        endDate,
      ] as const,
      queryFn: async () =>
        await axiosClient
          .get(
            `/alarm/anomaly/${companyId}?startDateTime=${startDate}&endDateTime=${endDate}`,
          )
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /anomaly/{companyId}
  const useAnomaly = (companyId: number) => {
    return useQuery({
      queryKey: ['anomaly', companyId] as const,
      queryFn: async () =>
        await axiosClient
          .get(`/anomaly/${companyId}`)
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  // /report/energy/{companyId}?startDate={dates[0]}&endDate={dates[1]}
  const useReportEnergyWithDates = (companyId: number, dates: string[]) => {
    return useQuery({
      queryKey: ['reportEnergyWithDates', companyId, dates] as const,
      queryFn: async () =>
        await axiosClient
          .get(
            `/report/energy/${companyId}?startDate=${dates[0]}&endDate=${dates[1] || dates[0]}`,
          )
          .then((response) => response.data.data),
      enabled: companyId != 0,
    });
  };

  return {
    // useAuthInfo,
    useAuthRoleInfo,
    useAuthCompanyInfo,
    useCountryList,
    useMenuList,
    useCompanyList,
    useSystemNotificationList,
    useManageCountryList,
    useManageCompanyList,
    useSubscription,
    useMemberList,
    useMemberOneWithoutMasking,
    useEnergyRealtimeForMain,
    useEnergyRealtime,
    useEnergyMonthly,
    useEnergyWithDates,
    useIotHistoryRealtime,
    useIotHistoryWithDates,
    useApiCallLogWithDate,
    useHourlyRates,
    usePaymentWithDates,
    useAlarmAnomalyWithDates,
    useAnomaly,
    useReportEnergyWithDates,
  };
};

export default queries;
