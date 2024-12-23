import ai from '../../images/icon/ai_icon.png';
import api from '../../images/icon/api_icon.png';
import storage from '../../images/icon/storage_icon.png';
import { useEffect, useState } from 'react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { fetchData } from '../../api';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useRecoilValue } from 'recoil';
import moment from 'moment'; // moment 추가
import { Calendar, EventProps, momentLocalizer } from 'react-big-calendar';
import '../../css/react-big-calendar.css';
import FacilityIcon from '../../path/FacilityIcon';
import { t } from 'i18next';

const localizer = momentLocalizer(moment);

type Payment = {
  usageDate: string;
  subscriptionServiceList: any[];
  apiCallCount: number;
  iotInstallationCount: number;
};

type PaymentInfo = {
  paymentList: Payment[];
  summaryApiCallCount: number;
  recentlyIotInstallationCount: number;
  recentlyStorageUsage: Record<string, number>;
  subscribedCount: Record<string, number>;
  summaryAmount: number;
  summaryApiCallAmount: number;
  summaryIotInstallationAmount: number;
  summaryStorageUsageAmount: number;
  summarySubscriptionAmount: number;
};

type EventType = 'ai' | 'api';

interface CalendarEvent extends EventProps {
  start: Date;
  end: Date;
  title: string;
  allDay: boolean;
  resource: Payment;
  type: EventType;
}

const CompanySubscription = ({
  companyId,
  companyName,
  companyType,
  onClose,
}: any) => {
  const loggedInUser = useRecoilValue(loggedInUserState);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentList: [],
    summaryApiCallCount: 0,
    recentlyIotInstallationCount: 0,
    recentlyStorageUsage: {},
    subscribedCount: {},
    summaryAmount: 0,
    summaryApiCallAmount: 0,
    summaryIotInstallationAmount: 0,
    summaryStorageUsageAmount: 0,
    summarySubscriptionAmount: 0,
  });

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // 현재 달의 1일과 말일 계산
  const startOfCurrentMonth = format(startOfMonth(currentMonth), 'yyyy-MM-dd');
  const endOfCurrentMonth = format(endOfMonth(currentMonth), 'yyyy-MM-dd');

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.setMonth(prev.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.setMonth(prev.getMonth() + 1)));
  };

  const getMonthYear = (date: any) => {
    return format(date, 'MMMM yyyy').toUpperCase();
  };

  const fetchPaymentInfo = async () => {
    if (loggedInUser && loggedInUser.memberId && companyId) {
      try {
        // API 호출을 통해 payment 정보 가져오기
        const data = await fetchData(
          `/payment/${companyId}?usageDateStart=${startOfCurrentMonth}&usageDateEnd=${endOfCurrentMonth}`,
        );
        setPaymentInfo(data.data);
      } catch (error) {
        console.error('Error while fetching payment info:', error);
      }
    }
  };

  const mergeAIEvents = (events: CalendarEvent[]): CalendarEvent[] => {
    if (events.length === 0) return [];

    const sortedEvents = events.sort(
      (a, b) => a.start.getTime() - b.start.getTime(),
    );
    const mergedEvents: CalendarEvent[] = [];
    let currentEvent = sortedEvents[0];

    for (let i = 1; i < sortedEvents.length; i++) {
      const nextEvent = sortedEvents[i];

      // 연속된 날짜이고, 같은 제목의 이벤트일 경우
      if (
        currentEvent.end.getTime() >=
          nextEvent.start.getTime() - 24 * 60 * 60 * 1000 &&
        currentEvent.title === nextEvent.title
      ) {
        currentEvent.end = new Date(
          Math.max(currentEvent.end.getTime(), nextEvent.end.getTime()),
        );
      } else {
        // 종료 날짜를 포함시키기 위해 1일 추가
        currentEvent.end = new Date(
          currentEvent.end.getTime() + 24 * 60 * 60 * 1000,
        );
        mergedEvents.push(currentEvent);
        currentEvent = nextEvent;
      }
    }

    currentEvent.end = new Date(
      currentEvent.end.getTime() + 24 * 60 * 60 * 1000,
    );
    mergedEvents.push(currentEvent);

    return mergedEvents;
  };

  const generateEvents = () => {
    const paymentList = paymentInfo.paymentList;

    const aiEvents: any[] = paymentList
      .filter((payment) => payment.subscriptionServiceList.length > 0)
      .map((payment) => ({
        start: parseISO(payment.usageDate),
        end: parseISO(payment.usageDate),
        title: 'AI',
        allDay: true,
        resource: payment,
        type: 'ai', // 추가 속성
      }));

    const apiEvents: any[] = paymentList
      .filter((payment) => payment.apiCallCount > 0)
      .map((payment) => ({
        start: parseISO(payment.usageDate),
        end: parseISO(payment.usageDate),
        title: `API ${payment.apiCallCount}`, // API 호출 수를 포함
        allDay: true,
        resource: payment,
        type: 'api', // 추가 속성
      }));

    const mergedAIEvents = mergeAIEvents(aiEvents);
    setEvents([...mergedAIEvents, ...apiEvents]);
  };

  useEffect(() => {
    fetchPaymentInfo();
  }, [currentMonth]);

  useEffect(() => {
    generateEvents();
  }, [paymentInfo]); // paymentInfo가 업데이트될 때마다 generateEvents 호출

  // 이벤트 스타일 설정 함수
  const eventStyleGetter = (event: CalendarEvent) => {
    let className = '';

    switch (event.type) {
      case 'ai':
        className = 'ai';
        break;
      case 'api':
        className = 'api';
        break;
      default:
        className = '';
        break;
    }

    return {
      className: `rbc-event ${className}`, // 클래스명 설정
    };
  };

  // 합산 Ai
  const getTotalSubscriptionCount = () => {
    return paymentInfo.paymentList.reduce(
      (total: number, payment: any) =>
        payment.subscriptionServiceList.length > 0 ? total + 1 : total,
      0,
    );
  };

  // 합산 ApiCall
  const getTotalApiCallCount = () => {
    return paymentInfo.paymentList.reduce(
      (total, payment: any) => total + payment.apiCallCount,
      0,
    );
  };

  // 합산 IotInstallation
  const getTotalIotInstallationCount = () => {
    // paymentList를 날짜 기준으로 정렬
    const sortedList = paymentInfo.paymentList.sort(
      (a, b) =>
        new Date(b.usageDate).getTime() - new Date(a.usageDate).getTime(),
    );

    // 가장 최근 항목의 iotInstallationCount 반환
    return sortedList[0]?.iotInstallationCount || 0;
  };

  // 합산 Storage
  // recentlyStorageUsage 객체의 첫 번째 키를 동적으로 추출
  const storageKey = Object.keys(paymentInfo.recentlyStorageUsage)[0];

  // 해당 키의 값을 기가바이트로 변환
  const storageUsageInGB = storageKey
    ? paymentInfo.recentlyStorageUsage[storageKey] / (1024 * 1024 * 1024)
    : 0;

  return (
    <div className="grid-rows grid gap-4">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {/* {moment(currentMonth).format('YYYY-MM')}  */}
          {companyName} {t('Usage History')}
        </h3>
      </div>

      <div className="w-full px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            {moment(currentMonth).format('YYYY-MM')}
          </h3>
          <div>
            <button
              onClick={handlePrevMonth}
              className="mr-2 rounded border border-stroke p-1 text-xl font-bold shadow-card-2 hover:bg-meta-2
            "
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'rotate(90deg)' }}
              >
                <path
                  d="M9.0002 12.825C8.83145 12.825 8.69082 12.7688 8.5502 12.6563L2.08145 6.30002C1.82832 6.0469 1.82832 5.65315 2.08145 5.40002C2.33457 5.1469 2.72832 5.1469 2.98145 5.40002L9.0002 11.2781L15.0189 5.34377C15.2721 5.09065 15.6658 5.09065 15.9189 5.34377C16.1721 5.5969 16.1721 5.99065 15.9189 6.24377L9.45019 12.6C9.30957 12.7406 9.16895 12.825 9.0002 12.825Z"
                  fill="#64748B"
                />
              </svg>
            </button>
            <button
              onClick={handleNextMonth}
              className="rounded border border-stroke p-1 text-xl font-bold shadow-card-2 hover:bg-meta-2"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'rotate(-90deg)' }}
              >
                <path
                  d="M9.0002 12.825C8.83145 12.825 8.69082 12.7688 8.5502 12.6563L2.08145 6.30002C1.82832 6.0469 1.82832 5.65315 2.08145 5.40002C2.33457 5.1469 2.72832 5.1469 2.98145 5.40002L9.0002 11.2781L15.0189 5.34377C15.2721 5.09065 15.6658 5.09065 15.9189 5.34377C16.1721 5.5969 16.1721 5.99065 15.9189 6.24377L9.45019 12.6C9.30957 12.7406 9.16895 12.825 9.0002 12.825Z"
                  fill="#64748B"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-5">
        <div className="col-span-1 bg-white dark:bg-boxdark lg:col-span-1  md:col-span-2 xl:col-span-3">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }}
            views={['month']}
            date={currentMonth}
            onNavigate={setCurrentMonth}
            eventPropGetter={eventStyleGetter}
            className="rbc-calendar"
          />
        </div>
      </div>

      <div className="w-full px-5">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {companyName} / {companyType}
        </h3>
      </div>

      <div className="w-full px-5">
        <table className="w-full leading-loose">
          <tbody className="w-full">
            <tr className="h-10 w-full border-b border-t border-stroke">
              <td className="w-3/12 font-semibold text-black">
                <div className="flex gap-2 align-middle">
                  <p className="flex h-8 w-8 items-center justify-center rounded-full bg-meta-2">
                    <img src={ai} alt="Logo" />
                  </p>
                  AI
                </div>
              </td>
              <td className="w-5/12 text-sm">-</td>
              <td className="w-2/12">
                {getTotalSubscriptionCount()}
                <span className="ml-0.5">{t('days')}</span>
              </td>
              <td className="w-2/12 text-right">
                {paymentInfo.summarySubscriptionAmount} &#36;
              </td>
            </tr>
            <tr className="h-10 w-full border-b border-stroke">
              <td className="w-3/12 font-semibold text-black">
                <div className="flex gap-2 align-middle">
                  <p className="flex h-8 w-8 items-center justify-center rounded-full bg-meta-2">
                    <img src={api} alt="Logo" />
                  </p>
                  API
                </div>
              </td>
              <td className="w-5/12 text-sm">
                {startOfCurrentMonth} ~ {endOfCurrentMonth}
              </td>
              <td className="w-2/12">
                {getTotalApiCallCount()}
                <span className="ml-0.5">{t('calls')}</span>
              </td>
              <td className="w-2/12 text-right">
                {paymentInfo.summaryApiCallAmount} &#36;
              </td>
            </tr>
            <tr className="h-10 w-full border-b border-stroke">
              <td className="w-3/12 font-semibold text-black">
                <div className="flex gap-2 align-middle">
                  <p className="flex h-8 w-8 items-center justify-center rounded-full bg-meta-2">
                    <FacilityIcon />
                  </p>
                  {t('Facilities')}
                </div>
              </td>
              <td className="w-5/12 text-sm">
                {startOfCurrentMonth} ~ {endOfCurrentMonth}
              </td>
              <td className="w-2/12">
                {getTotalIotInstallationCount()}
                <span className="ml-0.5">{t('units')}</span>
              </td>
              <td className="w-2/12 text-right">
                {paymentInfo.summaryIotInstallationAmount} &#36;
              </td>
            </tr>
            <tr className="h-10 w-full border-b border-stroke">
              <td className="w-3/12 font-semibold text-black">
                <div className="flex gap-2 align-middle">
                  <p className="flex h-8 w-8 items-center justify-center rounded-full bg-meta-2">
                    <img src={storage} alt="Logo" />
                  </p>
                  {t('Storage')}
                </div>
              </td>
              <td className="w-5/12 text-sm">
                {startOfCurrentMonth} ~ {endOfCurrentMonth}
              </td>
              <td className="w-2/12">
                {storageUsageInGB < 0.01
                  ? `${storageUsageInGB.toFixed(3)}`
                  : `${storageUsageInGB.toFixed(2)}`}
                <span className="ml-0.5">GB</span>
              </td>
              <td className="w-2/12 text-right">
                {paymentInfo.summaryStorageUsageAmount} &#36;
              </td>
            </tr>
            <tr className="h-10 w-full font-medium text-primary">
              <td className="w-3/12"></td>
              <td className="w-5/12"></td>
              <td className="w-2/12">{t('Total')}</td>
              <td className="w-2/12 text-right">
                {paymentInfo.summaryAmount} &#36;
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="my-4 flex w-full justify-center">
        <button
          type="submit"
          className="cursor-pointer rounded border border-stroke bg-gray px-5 py-1.5 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
          onClick={onClose}
        >
          {t('Button.Close')}
        </button>
      </div>
    </div>
  );
};

export default CompanySubscription;
