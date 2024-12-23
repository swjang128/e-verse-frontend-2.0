import { useRecoilState } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { patchData } from '../../api';
import Modal from '../../Modal';
import { t } from 'i18next';
import { CompanyData } from '../../types/company';
import EditMyCompany from '../Profile/EditMyCompany';
import { useQueryClient } from '@tanstack/react-query';

interface MyPageCompanyContentsWrapperProps {
  info: CompanyData;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyPageCompanyContentsWrapper: React.FC<
  MyPageCompanyContentsWrapperProps
> = ({ info, isModalOpen, setIsModalOpen }) => {
  const queryClient = useQueryClient();

  const handleSave = async (updateCompanyInfo: CompanyData) => {
    try {
      await patchData(
        `/company/${updateCompanyInfo.companyId}`,
        updateCompanyInfo,
      );
      queryClient.invalidateQueries({
        queryKey: ['authCompanyInfo'],
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error while updating info:', error);
      // 에러 처리
    }
  };

  return (
    <>
      <div className="border-t border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <ul className="flex flex-col">
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('CountryName')}</span>
            <span>{info.countryName}</span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Address')}</span>
            <span>{info.address}</span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Email')}</span>
            <span>{info.email}</span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Tel')}</span>
            <span>{info.tel}</span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Fax')}</span>
            <span>{info.fax}</span>
          </li>
        </ul>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {info && (
          <EditMyCompany
            info={info}
            onSave={(updatedInfo: any) => handleSave(updatedInfo)}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </>
  );
};

export default MyPageCompanyContentsWrapper;
