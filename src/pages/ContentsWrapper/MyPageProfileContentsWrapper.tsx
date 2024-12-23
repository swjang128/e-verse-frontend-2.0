import { useRecoilState } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { LoggedInUser } from '../../types/user';
import { patchData } from '../../api';
import Modal from '../../Modal';
import EditProfile from '../Profile/EditProfile';
import { t } from 'i18next';
import { useQueryClient } from '@tanstack/react-query';

// Props 타입 정의 (TypeScript를 사용하는 경우)
interface MyPageProfileContentsWrapperProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyPageProfileContentsWrapper: React.FC<
  MyPageProfileContentsWrapperProps
> = ({ isModalOpen, setIsModalOpen }) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const queryClient = useQueryClient();

  // 개인정보 수정
  const handleSave = async (updatedInfo: LoggedInUser) => {
    try {
      const response = await patchData(
        `/member/${loggedInUser?.memberId}`,
        updatedInfo,
      );
      setLoggedInUser(response.data);
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
            <span className="font-semibold">{t('Name')}</span>
            <span>{loggedInUser?.name}</span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Email')}</span>
            <span>{loggedInUser?.email}</span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Phone')}</span>
            <span>{loggedInUser?.phone}</span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Company')}</span>
            <span>{loggedInUser?.companyName}</span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Type')}</span>
            <span>{loggedInUser?.companyType}</span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Role')}</span>
            <span>{loggedInUser?.role}</span>
          </li>
        </ul>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <EditProfile
          info={loggedInUser}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default MyPageProfileContentsWrapper;
