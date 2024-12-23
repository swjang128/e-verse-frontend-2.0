import { E_DATE_TYPES } from '../enum';

export const getCurrentDateWithTimezone = (usableLanguages: any): string => {
  // 'localStorage'에서 사용자가 선택한 국가 코드를 가져옵니다.
  // util단에서는 hook이 사용이 안되어서 localStorage로 적용함
  const userLanguageData = JSON.parse(
    localStorage.getItem('selectLanguagePersist') || '{}',
  );

  const userSelectedCountryCode =
    userLanguageData?.selectLanguageState || 'en-US'; // 기본값: 'en-US'
  const timezone = usableLanguages[userSelectedCountryCode].timeZone;

  // 현재 날짜와 시간에 대해 국가 코드와 타임존을 적용하여 포맷합니다.
  const now = new Date();
  const formatToPartsDate = new Intl.DateTimeFormat(userSelectedCountryCode, {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24시간제로 설정
    calendar: 'gregory', // 그레고리력으로 설정
  }).formatToParts(now);

  // 'yyyy-MM-dd HH:MM:SS' 형식으로 변환
  const year = formatToPartsDate.find(
    (part) => part.type === E_DATE_TYPES.YEAR,
  )?.value;
  const month = formatToPartsDate.find(
    (part) => part.type === E_DATE_TYPES.MONTH,
  )?.value;
  const day = formatToPartsDate.find(
    (part) => part.type === E_DATE_TYPES.DAY,
  )?.value;
  const hour = formatToPartsDate.find(
    (part) => part.type === E_DATE_TYPES.HOUR,
  )?.value;
  const minute = formatToPartsDate.find(
    (part) => part.type === E_DATE_TYPES.MINUTE,
  )?.value;
  const second = formatToPartsDate.find(
    (part) => part.type === E_DATE_TYPES.SECOND,
  )?.value;

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export const getCurrentDateDetails = (usableLanguages: any) => {
  const now = new Date(getCurrentDateWithTimezone(usableLanguages));
  const formatDate = () => {
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return { year, month, day, fullDate: `${year}-${month}-${day}` };
  };

  const formatTime = () => {
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return {
    date: formatDate(), // 현재 년,월,일을 json로 리턴
    time: formatTime(), // 현재 시간,분,초를 json로 리턴
  };
};

export const getMonthDates = (
  usableLanguages: any,
): { endDate: number; datesArray: string[] } => {
  const now = new Date(getCurrentDateWithTimezone(usableLanguages));
  const year = now.getFullYear();
  const month = now.getMonth(); // 현재 월 (0부터 시작)

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const datesArray: string[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    datesArray.push(day.toString());
  }

  return {
    endDate: daysInMonth, // 현재 월의 마지막 날짜를 number로 리턴
    datesArray: datesArray, // 현재 월의 일수를 array로 리턴
  };
};

export const getCurrentDate = (usableLanguages: any) => {
  const now = new Date(getCurrentDateWithTimezone(usableLanguages));
  const formatDate = () => {
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return formatDate();
};

export const getCurrentMonthFirstDate = (usableLanguages: any) => {
  const now = new Date(getCurrentDateWithTimezone(usableLanguages));
  const formatDate = () => {
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = '01';
    return `${year}-${month}-${day}`;
  };

  return formatDate();
};

export const getPreviousMonthCurrentDate = (usableLanguages: any) => {
  const now = new Date(getCurrentDateWithTimezone(usableLanguages));
  const formatDate = () => {
    const year = now.getFullYear().toString();
    const month = String(now.getMonth()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return formatDate();
};

export const getPreviousMonthFirstDate = (usableLanguages: any) => {
  const now = new Date(getCurrentDateWithTimezone(usableLanguages));
  const formatDate = () => {
    const year = now.getFullYear().toString();
    const month = String(now.getMonth()).padStart(2, '0');
    const day = '01';
    return `${year}-${month}-${day}`;
  };

  return formatDate();
};

export const getHarfYearAgoCurrentDate = (usableLanguages: any) => {
  const now = new Date(getCurrentDateWithTimezone(usableLanguages));
  const formatDate = () => {
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() - 5).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return formatDate();
};
