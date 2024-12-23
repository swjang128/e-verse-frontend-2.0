import { useEffect, useState } from 'react';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useRecoilValue } from 'recoil';
import moment from 'moment';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { getCurrentDate } from '../../hooks/getStringedDate';

const CurrentMonthTotalSummaryContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const { useEnergyMonthly } = queries();
  const {
    data: energyMonthlyData,
    error,
    isLoading,
  } = useEnergyMonthly(loggedInUser?.companyId || 0);
  const currentDate = getCurrentDate(usableLanguages);
  const [sumEnergyUsage, setSumEnergyUsage] = useState<string>();
  const [isPreviousMonthGreaterUsage, setIsPreviousMonthGreaterUsage] =
    useState(true); // 전월이 더 큼
  const [
    differencePreviousMonthEnergyUsage,
    setDifferencePreviousMonthEnergyUsage,
  ] = useState<string>();
  const [sumPredictedUsage, setSumPredictedUsage] = useState<string>();
  const [sumBillStatus, setSumBillStatus] = useState<string>();
  const [isPreviousMonthGreaterBill, setIsPreviousMonthGreaterBill] =
    useState(true); // 전월이 더 큼
  const [
    differencePreviousMonthBillStatus,
    setDifferencePreviousMonthBillStatus,
  ] = useState<string>();
  const [sumPredictedBill, setSumPredictedBill] = useState<string>();
  const [sumAccuracy, setSumAccuracy] = useState<string>();

  useEffect(() => {
    if (energyMonthlyData) {
      setSumEnergyUsage(
        Math.round(energyMonthlyData.thisMonthData.summaryUsage).toLocaleString(
          'en-US',
        ),
      );
      if (
        Number(energyMonthlyData.thisMonthData.summaryUsage) >
        Number(energyMonthlyData.lastMonthData.summaryUsage)
      ) {
        // 당월이 더 큼 = 전월이 더 큼을 false처리
        setIsPreviousMonthGreaterUsage(false);
      }
      setDifferencePreviousMonthEnergyUsage(
        Number(energyMonthlyData.lastMonthData.summaryUsage) === 0
          ? '0'
          : Math.abs(
              100 -
                Math.round(
                  (Number(energyMonthlyData.thisMonthData.summaryUsage) /
                    Number(energyMonthlyData.lastMonthData.summaryUsage)) *
                    100,
                ),
            ).toString(),
      );
      if (
        Number(energyMonthlyData.thisMonthData.summaryBill) >
        Number(energyMonthlyData.lastMonthData.summaryBill)
      ) {
        // 당월이 더 큼 = 전월이 더 큼을 false처리
        setIsPreviousMonthGreaterBill(false);
      }
      setDifferencePreviousMonthBillStatus(
        Number(energyMonthlyData.lastMonthData.summaryBill) === 0
          ? '0'
          : Math.abs(
              100 -
                Math.round(
                  (Number(energyMonthlyData.thisMonthData.summaryBill) /
                    Number(energyMonthlyData.lastMonthData.summaryBill)) *
                    100,
                ),
            ).toString(),
      );
      setSumPredictedUsage(
        Math.round(
          energyMonthlyData.thisMonthData.summaryForecastUsage,
        ).toLocaleString('en-US'),
      );
      setSumBillStatus(
        Math.round(energyMonthlyData.thisMonthData.summaryBill).toLocaleString(
          'en-US',
        ),
      );
      setSumPredictedBill(
        Math.round(
          energyMonthlyData.thisMonthData.summaryForecastBill,
        ).toLocaleString('en-US'),
      );
      setSumAccuracy(
        Math.round(
          energyMonthlyData.thisMonthData.summaryForecastAccuracy,
        ).toString(),
      );
    }
  }, [energyMonthlyData]);

  return (
    <>
      {/* 전력 사용량*/}
      <div className="border-gray-400 flex flex-1 items-center justify-between border-y border-stroke px-7">
        <div className="flex gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 12C2.5 7.77 2.5 5.655 3.698 4.253C3.86867 4.053 4.05367 3.868 4.253 3.698C5.655 2.5 7.77 2.5 12 2.5C16.23 2.5 18.345 2.5 19.747 3.698C19.947 3.86867 20.132 4.05367 20.302 4.253C21.5 5.655 21.5 7.77 21.5 12C21.5 16.23 21.5 18.345 20.302 19.747C20.1313 19.947 19.9463 20.132 19.747 20.302C18.345 21.5 16.23 21.5 12 21.5C7.77 21.5 5.655 21.5 4.253 20.302C4.053 20.1313 3.868 19.9463 3.698 19.747C2.5 18.345 2.5 16.23 2.5 12Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.12897 11.5978L12.128 6.20784C12.441 5.78584 13.027 6.04784 13.027 6.60984V10.7818C13.027 11.1178 13.257 11.3908 13.541 11.3908H15.485C15.927 11.3908 16.163 12.0088 15.871 12.4018L11.872 17.7918C11.559 18.2138 10.973 17.9518 10.973 17.3898V13.2178C10.973 12.8818 10.743 12.6088 10.459 12.6088H8.51497C8.07397 12.6088 7.83797 11.9908 8.12997 11.5978"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <span className="block text-lg font-semibold text-black dark:text-white">
              {t('Power Usage')}
            </span>
            <span className="block text-miniTitle-sm font-semibold">
              {t('Compared to Previous Month')}
              {isPreviousMonthGreaterUsage === true ? ' -' : ' +'}
              {differencePreviousMonthEnergyUsage || 0} %
            </span>
          </div>
        </div>
        <span className="font-semibold text-black dark:text-white">
          {sumEnergyUsage || 0} kwh
        </span>
      </div>

      {/* 예측 사용량*/}
      <div className="border-gray-400 flex flex-1 items-center justify-between border-b border-stroke px-7">
        <div className="flex gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 55 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.2839 2.62679C17.2839 2.013 17.0401 1.42435 16.6061 0.990338C16.1721 0.556326 15.5834 0.3125 14.9696 0.3125C14.3559 0.3125 13.7672 0.556326 13.3332 0.990338C12.8992 1.42435 12.6554 2.013 12.6554 2.62679V6.48393H11.8839C10.4518 6.48393 9.07825 7.05286 8.06555 8.06555C7.05286 9.07825 6.48393 10.4518 6.48393 11.8839V12.6554H2.62679C2.013 12.6554 1.42435 12.8992 0.990338 13.3332C0.556326 13.7672 0.3125 14.3559 0.3125 14.9696C0.3125 15.5834 0.556326 16.1721 0.990338 16.6061C1.42435 17.0401 2.013 17.2839 2.62679 17.2839H6.48393V24.9982H2.62679C2.013 24.9982 1.42435 25.242 0.990338 25.6761C0.556326 26.1101 0.3125 26.6987 0.3125 27.3125C0.3125 27.9263 0.556326 28.5149 0.990338 28.9489C1.42435 29.383 2.013 29.6268 2.62679 29.6268H6.48393V37.3411H2.62679C2.013 37.3411 1.42435 37.5849 0.990338 38.0189C0.556326 38.4529 0.3125 39.0416 0.3125 39.6554C0.3125 40.2691 0.556326 40.8578 0.990338 41.2918C1.42435 41.7258 2.013 41.9696 2.62679 41.9696H6.48393V42.7411C6.48393 45.7219 8.90313 48.1411 11.8839 48.1411H12.6554V51.9982C12.6554 52.612 12.8992 53.2007 13.3332 53.6347C13.7672 54.0687 14.3559 54.3125 14.9696 54.3125C15.5834 54.3125 16.1721 54.0687 16.6061 53.6347C17.0401 53.2007 17.2839 52.612 17.2839 51.9982V48.1411H24.9982V51.9982C24.9982 52.612 25.242 53.2007 25.6761 53.6347C26.1101 54.0687 26.6987 54.3125 27.3125 54.3125C27.9263 54.3125 28.5149 54.0687 28.9489 53.6347C29.383 53.2007 29.6268 52.612 29.6268 51.9982V48.1411H37.3411V51.9982C37.3411 52.612 37.5849 53.2007 38.0189 53.6347C38.4529 54.0687 39.0416 54.3125 39.6554 54.3125C40.2691 54.3125 40.8578 54.0687 41.2918 53.6347C41.7258 53.2007 41.9696 52.612 41.9696 51.9982V48.1411H42.7411C44.1732 48.1411 45.5468 47.5721 46.5594 46.5594C47.5721 45.5468 48.1411 44.1732 48.1411 42.7411V41.9696H51.9982C52.612 41.9696 53.2007 41.7258 53.6347 41.2918C54.0687 40.8578 54.3125 40.2691 54.3125 39.6554C54.3125 39.0416 54.0687 38.4529 53.6347 38.0189C53.2007 37.5849 52.612 37.3411 51.9982 37.3411H48.1411V29.6268H51.9982C52.612 29.6268 53.2007 29.383 53.6347 28.9489C54.0687 28.5149 54.3125 27.9263 54.3125 27.3125C54.3125 26.6987 54.0687 26.1101 53.6347 25.6761C53.2007 25.242 52.612 24.9982 51.9982 24.9982H48.1411V17.2839H51.9982C52.612 17.2839 53.2007 17.0401 53.6347 16.6061C54.0687 16.1721 54.3125 15.5834 54.3125 14.9696C54.3125 14.3559 54.0687 13.7672 53.6347 13.3332C53.2007 12.8992 52.612 12.6554 51.9982 12.6554H48.1411V11.8839C48.1411 10.4518 47.5721 9.07825 46.5594 8.06555C45.5468 7.05286 44.1732 6.48393 42.7411 6.48393H41.9696V2.62679C41.9696 2.013 41.7258 1.42435 41.2918 0.990338C40.8578 0.556326 40.2691 0.3125 39.6554 0.3125C39.0416 0.3125 38.4529 0.556326 38.0189 0.990338C37.5849 1.42435 37.3411 2.013 37.3411 2.62679V6.48393H29.6268V2.62679C29.6268 2.013 29.383 1.42435 28.9489 0.990338C28.5149 0.556326 27.9263 0.3125 27.3125 0.3125C26.6987 0.3125 26.1101 0.556326 25.6761 0.990338C25.242 1.42435 24.9982 2.013 24.9982 2.62679V6.48393H17.2839V2.62679ZM11.1125 11.8839C11.1125 11.6793 11.1938 11.4831 11.3384 11.3384C11.4831 11.1938 11.6793 11.1125 11.8839 11.1125H42.7411C42.9457 11.1125 43.1419 11.1938 43.2866 11.3384C43.4312 11.4831 43.5125 11.6793 43.5125 11.8839V42.7411C43.5125 42.9457 43.4312 43.1419 43.2866 43.2866C43.1419 43.4312 42.9457 43.5125 42.7411 43.5125H11.8839C11.6793 43.5125 11.4831 43.4312 11.3384 43.2866C11.1938 43.1419 11.1125 42.9457 11.1125 42.7411V11.8839ZM26.6923 35.8075L25.8437 33.4253H19.589L18.7404 35.8075C18.5342 36.3857 18.1067 36.8582 17.552 37.1213C16.9973 37.3843 16.3609 37.4162 15.7827 37.2099C15.2045 37.0037 14.732 36.5762 14.4689 36.0216C14.2059 35.4669 14.174 34.8305 14.3803 34.2523L19.626 19.5334L19.6352 19.5056L19.6476 19.4748C20.1166 18.2652 21.2398 17.2808 22.7148 17.2808C24.1928 17.2808 25.313 18.2652 25.7851 19.4779L25.7943 19.5056L25.8067 19.5365L31.0524 34.2554C31.2485 34.8312 31.2101 35.461 30.9453 36.0087C30.6806 36.5564 30.2109 36.9778 29.6378 37.1818C29.0648 37.3858 28.4344 37.356 27.8832 37.0988C27.3319 36.8416 26.9041 36.3777 26.6923 35.8075ZM22.7148 24.6526L24.1928 28.7967H21.2367L22.7148 24.6526ZM34.2554 19.592C34.2554 18.9783 34.4992 18.3896 34.9332 17.9556C35.3672 17.5216 35.9559 17.2778 36.5696 17.2778C37.1834 17.2778 37.7721 17.5216 38.2061 17.9556C38.6401 18.3896 38.8839 18.9783 38.8839 19.592V35.0299C38.8839 35.6437 38.6401 36.2323 38.2061 36.6663C37.7721 37.1003 37.1834 37.3442 36.5696 37.3442C35.9559 37.3442 35.3672 37.1003 34.9332 36.6663C34.4992 36.2323 34.2554 35.6437 34.2554 35.0299V19.592Z"
                fill="#02004A"
              />
            </svg>
          </span>
          <div>
            <span className="block text-lg font-semibold text-black dark:text-white">
              {t('Predicted Usage')}
            </span>
            <span className="block text-miniTitle-sm font-semibold">
              {moment(currentDate).format('YYYY-MM')} {t('Summary')}
            </span>
          </div>
        </div>
        <span className="font-semibold text-black dark:text-white">
          {sumPredictedUsage || 0} kwh
        </span>
      </div>

      {/* 전력 사용량*/}
      <div className="border-gray-400 flex flex-1 items-center justify-between border-b border-stroke px-7">
        <div className="flex gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 12C2.5 7.77 2.5 5.655 3.698 4.253C3.86867 4.053 4.05367 3.868 4.253 3.698C5.655 2.5 7.77 2.5 12 2.5C16.23 2.5 18.345 2.5 19.747 3.698C19.947 3.86867 20.132 4.05367 20.302 4.253C21.5 5.655 21.5 7.77 21.5 12C21.5 16.23 21.5 18.345 20.302 19.747C20.1313 19.947 19.9463 20.132 19.747 20.302C18.345 21.5 16.23 21.5 12 21.5C7.77 21.5 5.655 21.5 4.253 20.302C4.053 20.1313 3.868 19.9463 3.698 19.747C2.5 18.345 2.5 16.23 2.5 12Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.12897 11.5978L12.128 6.20784C12.441 5.78584 13.027 6.04784 13.027 6.60984V10.7818C13.027 11.1178 13.257 11.3908 13.541 11.3908H15.485C15.927 11.3908 16.163 12.0088 15.871 12.4018L11.872 17.7918C11.559 18.2138 10.973 17.9518 10.973 17.3898V13.2178C10.973 12.8818 10.743 12.6088 10.459 12.6088H8.51497C8.07397 12.6088 7.83797 11.9908 8.12997 11.5978"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <span className="block text-lg font-semibold text-black dark:text-white">
              {t('Bill Status')}
            </span>
            <span className="block text-miniTitle-sm font-semibold">
              {t('Compared to Previous Month')}
              {isPreviousMonthGreaterBill === true ? ' -' : ' +'}
              {differencePreviousMonthBillStatus || 0} %
            </span>
          </div>
        </div>
        <span className="font-semibold text-black dark:text-white">
          {sumBillStatus || 0} &#36;
        </span>
      </div>

      {/* 예측 사용량*/}
      <div className="border-gray-400 flex flex-1 items-center justify-between border-b border-stroke px-7">
        <div className="flex gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 55 55"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.2839 2.62679C17.2839 2.013 17.0401 1.42435 16.6061 0.990338C16.1721 0.556326 15.5834 0.3125 14.9696 0.3125C14.3559 0.3125 13.7672 0.556326 13.3332 0.990338C12.8992 1.42435 12.6554 2.013 12.6554 2.62679V6.48393H11.8839C10.4518 6.48393 9.07825 7.05286 8.06555 8.06555C7.05286 9.07825 6.48393 10.4518 6.48393 11.8839V12.6554H2.62679C2.013 12.6554 1.42435 12.8992 0.990338 13.3332C0.556326 13.7672 0.3125 14.3559 0.3125 14.9696C0.3125 15.5834 0.556326 16.1721 0.990338 16.6061C1.42435 17.0401 2.013 17.2839 2.62679 17.2839H6.48393V24.9982H2.62679C2.013 24.9982 1.42435 25.242 0.990338 25.6761C0.556326 26.1101 0.3125 26.6987 0.3125 27.3125C0.3125 27.9263 0.556326 28.5149 0.990338 28.9489C1.42435 29.383 2.013 29.6268 2.62679 29.6268H6.48393V37.3411H2.62679C2.013 37.3411 1.42435 37.5849 0.990338 38.0189C0.556326 38.4529 0.3125 39.0416 0.3125 39.6554C0.3125 40.2691 0.556326 40.8578 0.990338 41.2918C1.42435 41.7258 2.013 41.9696 2.62679 41.9696H6.48393V42.7411C6.48393 45.7219 8.90313 48.1411 11.8839 48.1411H12.6554V51.9982C12.6554 52.612 12.8992 53.2007 13.3332 53.6347C13.7672 54.0687 14.3559 54.3125 14.9696 54.3125C15.5834 54.3125 16.1721 54.0687 16.6061 53.6347C17.0401 53.2007 17.2839 52.612 17.2839 51.9982V48.1411H24.9982V51.9982C24.9982 52.612 25.242 53.2007 25.6761 53.6347C26.1101 54.0687 26.6987 54.3125 27.3125 54.3125C27.9263 54.3125 28.5149 54.0687 28.9489 53.6347C29.383 53.2007 29.6268 52.612 29.6268 51.9982V48.1411H37.3411V51.9982C37.3411 52.612 37.5849 53.2007 38.0189 53.6347C38.4529 54.0687 39.0416 54.3125 39.6554 54.3125C40.2691 54.3125 40.8578 54.0687 41.2918 53.6347C41.7258 53.2007 41.9696 52.612 41.9696 51.9982V48.1411H42.7411C44.1732 48.1411 45.5468 47.5721 46.5594 46.5594C47.5721 45.5468 48.1411 44.1732 48.1411 42.7411V41.9696H51.9982C52.612 41.9696 53.2007 41.7258 53.6347 41.2918C54.0687 40.8578 54.3125 40.2691 54.3125 39.6554C54.3125 39.0416 54.0687 38.4529 53.6347 38.0189C53.2007 37.5849 52.612 37.3411 51.9982 37.3411H48.1411V29.6268H51.9982C52.612 29.6268 53.2007 29.383 53.6347 28.9489C54.0687 28.5149 54.3125 27.9263 54.3125 27.3125C54.3125 26.6987 54.0687 26.1101 53.6347 25.6761C53.2007 25.242 52.612 24.9982 51.9982 24.9982H48.1411V17.2839H51.9982C52.612 17.2839 53.2007 17.0401 53.6347 16.6061C54.0687 16.1721 54.3125 15.5834 54.3125 14.9696C54.3125 14.3559 54.0687 13.7672 53.6347 13.3332C53.2007 12.8992 52.612 12.6554 51.9982 12.6554H48.1411V11.8839C48.1411 10.4518 47.5721 9.07825 46.5594 8.06555C45.5468 7.05286 44.1732 6.48393 42.7411 6.48393H41.9696V2.62679C41.9696 2.013 41.7258 1.42435 41.2918 0.990338C40.8578 0.556326 40.2691 0.3125 39.6554 0.3125C39.0416 0.3125 38.4529 0.556326 38.0189 0.990338C37.5849 1.42435 37.3411 2.013 37.3411 2.62679V6.48393H29.6268V2.62679C29.6268 2.013 29.383 1.42435 28.9489 0.990338C28.5149 0.556326 27.9263 0.3125 27.3125 0.3125C26.6987 0.3125 26.1101 0.556326 25.6761 0.990338C25.242 1.42435 24.9982 2.013 24.9982 2.62679V6.48393H17.2839V2.62679ZM11.1125 11.8839C11.1125 11.6793 11.1938 11.4831 11.3384 11.3384C11.4831 11.1938 11.6793 11.1125 11.8839 11.1125H42.7411C42.9457 11.1125 43.1419 11.1938 43.2866 11.3384C43.4312 11.4831 43.5125 11.6793 43.5125 11.8839V42.7411C43.5125 42.9457 43.4312 43.1419 43.2866 43.2866C43.1419 43.4312 42.9457 43.5125 42.7411 43.5125H11.8839C11.6793 43.5125 11.4831 43.4312 11.3384 43.2866C11.1938 43.1419 11.1125 42.9457 11.1125 42.7411V11.8839ZM26.6923 35.8075L25.8437 33.4253H19.589L18.7404 35.8075C18.5342 36.3857 18.1067 36.8582 17.552 37.1213C16.9973 37.3843 16.3609 37.4162 15.7827 37.2099C15.2045 37.0037 14.732 36.5762 14.4689 36.0216C14.2059 35.4669 14.174 34.8305 14.3803 34.2523L19.626 19.5334L19.6352 19.5056L19.6476 19.4748C20.1166 18.2652 21.2398 17.2808 22.7148 17.2808C24.1928 17.2808 25.313 18.2652 25.7851 19.4779L25.7943 19.5056L25.8067 19.5365L31.0524 34.2554C31.2485 34.8312 31.2101 35.461 30.9453 36.0087C30.6806 36.5564 30.2109 36.9778 29.6378 37.1818C29.0648 37.3858 28.4344 37.356 27.8832 37.0988C27.3319 36.8416 26.9041 36.3777 26.6923 35.8075ZM22.7148 24.6526L24.1928 28.7967H21.2367L22.7148 24.6526ZM34.2554 19.592C34.2554 18.9783 34.4992 18.3896 34.9332 17.9556C35.3672 17.5216 35.9559 17.2778 36.5696 17.2778C37.1834 17.2778 37.7721 17.5216 38.2061 17.9556C38.6401 18.3896 38.8839 18.9783 38.8839 19.592V35.0299C38.8839 35.6437 38.6401 36.2323 38.2061 36.6663C37.7721 37.1003 37.1834 37.3442 36.5696 37.3442C35.9559 37.3442 35.3672 37.1003 34.9332 36.6663C34.4992 36.2323 34.2554 35.6437 34.2554 35.0299V19.592Z"
                fill="#02004A"
              />
            </svg>
          </span>
          <div>
            <span className="block text-lg font-semibold text-black dark:text-white">
              {t('Predicted Bill')}
            </span>
            <span className="block text-miniTitle-sm font-semibold">
              {moment(currentDate).format('YYYY-MM')} {t('Summary')}
            </span>
          </div>
        </div>
        <span className="font-semibold text-black dark:text-white">
          {sumPredictedBill || 0} &#36;
        </span>
      </div>

      {/* AI 예측 정확도 */}
      <div className="border-gray-400 flex flex-1 items-center justify-between px-7">
        <div className="flex gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-meta-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 42 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5833 37.6667H31.4167M8.5 8.5L21 6.41667L33.5 8.5M8.5 8.5L14.75 21C14.75 22.6576 14.0915 24.2473 12.9194 25.4194C11.7473 26.5915 10.1576 27.25 8.5 27.25C6.8424 27.25 5.25269 26.5915 4.08058 25.4194C2.90848 24.2473 2.25 22.6576 2.25 21L8.5 8.5ZM33.5 8.5L39.75 21C39.75 22.6576 39.0915 24.2473 37.9194 25.4194C36.7473 26.5915 35.1576 27.25 33.5 27.25C31.8424 27.25 30.2527 26.5915 29.0806 25.4194C27.9085 24.2473 27.25 22.6576 27.25 21L33.5 8.5ZM21 2.25V37.6667"
                stroke="black"
                strokeWidth="4.16667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <span className="block text-lg font-semibold text-black dark:text-white">
              {t('AI Prediction Accuracy')}
            </span>
            <span className="block text-miniTitle-sm font-semibold">
              OCI AI
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">{t('About')}</span>
          <span className="font-semibold text-black dark:text-white">
            {' '}
            {sumAccuracy || 0} %
          </span>
        </div>
      </div>
    </>
  );
};

export default CurrentMonthTotalSummaryContentsWrapper;
