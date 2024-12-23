import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useEffect, useState } from 'react';
import { fetchData, patchData } from '../../api';
import EditDetection from '../Ai/EditDetection';
import Modal from '../../Modal';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
interface AnomalyDetectionDetailsContentsWrapperProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AnomalyType {
  companyId: number;
  anomalyId: number;
  lowestHourlyEnergyUsage: number;
  highestHourlyEnergyUsage: number;
  available: boolean;
}

const AnomalyDetectionDetailsContentsWrapper: React.FC<
  AnomalyDetectionDetailsContentsWrapperProps
> = ({ isModalOpen, setIsModalOpen }) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const { useAnomaly } = queries();
  const {
    data: anomalyData,
    error,
    isLoading,
  } = useAnomaly(loggedInUser?.companyId || 0);
  const [anomalyInfo, setAnomalyInfo] = useState<AnomalyType>();

  // Detection정보 수정
  const handleSave = async (updatedInfo: any) => {
    try {
      const response = await patchData(
        `/anomaly/${updatedInfo?.anomalyId}`,
        updatedInfo,
      );
      setIsModalOpen(false);
      const data = await fetchData(`/anomaly/${loggedInUser?.companyId}`);
      setAnomalyInfo(data.data.anomalyList[0]);
    } catch (error) {
      console.error('Error while updating info:', error);
      // 에러 처리
    }
  };

  useEffect(() => {
    if (anomalyData) {
      setAnomalyInfo(
        anomalyData.anomalyList[0] || {
          lowestHourlyEnergyUsage: 0,
          highestHourlyEnergyUsage: 0,
          available: false,
        },
      );
    }
  }, [anomalyData]);

  return (
    <>
      <div className="border-t border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <ul className="flex flex-col">
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">
              {t('Lowest Hourly Energy Usage')}
            </span>
            <span>
              {anomalyInfo?.lowestHourlyEnergyUsage?.toLocaleString('en-US')}{' '}
              kwh
            </span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">
              {t('Highest Hourly Energy Usage')}
            </span>
            <span>
              {anomalyInfo?.highestHourlyEnergyUsage?.toLocaleString('en-US')}{' '}
              kwh
            </span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Available')}</span>
            <span>
              {anomalyInfo?.available === true ? t('enable') : t('disable')}
            </span>
          </li>
        </ul>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {anomalyInfo && (
          <EditDetection
            info={anomalyInfo}
            onSave={handleSave}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </>
  );
};
export default AnomalyDetectionDetailsContentsWrapper;
