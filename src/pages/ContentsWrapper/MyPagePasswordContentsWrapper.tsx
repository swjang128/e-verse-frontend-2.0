import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { patchData, resetPasswordData } from '../../api';
import Modal from '../../Modal';
import UpdatePassword from '../Profile/UpdatePassword';
import ConfirmCancelModal from '../../components/ConfirmCancelModal';
import { useState } from 'react';
import { t } from 'i18next';

const MyPagePasswordContentsWrapper = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);

  // 비밀번호 초기화
  const [pwUpdateModal, setPwUpdateModal] = useState(false);
  const [pwResetModal, setPwResetModal] = useState(false);

  // 비밀번호 수정
  const [updatPwdModal, setUpdatPwdModal] = useState(false);

  // 비밀번호 수정
  const handlePwUpdate = async (updatedPassword: any) => {
    try {
      updatedPassword.email = loggedInUser?.email;
      delete updatedPassword.confirmNewPassword;
      await patchData(`/auth/update-password`, updatedPassword);
      setUpdatPwdModal(false);
    } catch (error) {
      console.error('Error while adding member:', error);
    }
  };

  // 비밀번호 초기화
  const handlePwReset = async () => {
    try {
      await resetPasswordData(`/auth/reset-password`, {
        email: loggedInUser?.email,
      });
      setPwResetModal(false);
    } catch (error) {
      console.error('Error while resetting password:', error);
    }
  };

  return (
    <>
      <div className="border-t border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
        <ul className="flex flex-col">
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Update Password')}</span>
            <span>
              <button
                onClick={() => setPwUpdateModal(true)}
                className="min-w-24 items-center rounded border border-primary bg-transparent px-4 py-2 text-center font-medium text-primary hover:bg-primary hover:bg-opacity-90 hover:text-white dark:bg-primary dark:text-white xsm:max-w-1 md:max-w-40"
              >
                {t('Button.Edit')}
              </button>
            </span>
          </li>
          <li className="text-md flex h-15 items-center justify-between border-b border-stroke px-7.5 text-black last:border-b-0 dark:border-strokedark dark:bg-boxdark-2 dark:text-white">
            <span className="font-semibold">{t('Reset Password')}</span>
            <span>
              <button
                onClick={() => setPwResetModal(true)}
                className="min-w-24 items-center rounded border border-primary bg-transparent px-4 py-2 text-center font-medium text-primary hover:bg-primary hover:bg-opacity-90 hover:text-white dark:bg-primary dark:text-white xsm:max-w-1 md:max-w-40"
              >
                {t('Button.Reset')}
              </button>
            </span>
          </li>
        </ul>
      </div>
      <Modal isOpen={pwUpdateModal} onClose={() => setPwUpdateModal(false)}>
        <UpdatePassword
          info={loggedInUser}
          onSave={handlePwUpdate}
          onClose={() => setPwUpdateModal(false)}
        />
      </Modal>

      <ConfirmCancelModal
        isOpen={pwResetModal}
        onClose={() => setPwResetModal(false)}
        onConfirm={handlePwReset}
        title={t('Reset Password')}
        message={t(
          'Do you want to initialize the password? The initialized password is received by mail.',
        )}
      />
    </>
  );
};

export default MyPagePasswordContentsWrapper;
