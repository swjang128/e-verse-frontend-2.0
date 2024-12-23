import React, { useEffect, useState } from 'react';
import { LoggedInUser } from '../../types/user';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import { t } from 'i18next';
import { PrimaryInput } from './LogIn';
import { login, postAuthCodeData } from '../../api';
import { setAccessTokenCookie, setRefreshTokenCookie } from '../../cookies';
import { getDecodedToken } from '../../tokenDecode';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import LockIcon from '../../path/LockIcon';

interface EnterAuthCodeProps {
  primaryInputData: PrimaryInput;
  onClose: () => void;
}

interface FormValues {
  authCode: string;
}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EnterAuthCode: React.FC<EnterAuthCodeProps> = ({
  primaryInputData,
  onClose,
}) => {
  const [isActive, setIsActive] = useState(true); // 타이머 활성화 상태
  const [reset, setReset] = useState(false);
  const setLoggedInUser = useSetRecoilState(loggedInUserState);
  const nav = useNavigate();
  const { email } = primaryInputData;
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<FormValues>();

  // useEffect(() => {
  //   trigger('authCode');
  // }, []);

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    requestNotificationPermission();
    const loginSubmitData = {
      ...data,
      ...primaryInputData,
    };
    login('/auth/login', loginSubmitData).then(
      (res: any) => {
        // 받아온 토큰을 쿠키에 저장
        try {
          const { accessToken, refreshToken } = res;
          setAccessTokenCookie(accessToken);
          setRefreshTokenCookie(refreshToken);
          const decodedToken: any = getDecodedToken(accessToken);
          const {
            memberId,
            name,
            email,
            companyId,
            companyName,
            companyType,
            role,
            phone,
            accessibleMenuIds,
          } = decodedToken;
          const loggedInUser: LoggedInUser = {
            name,
            companyName,
            companyType,
            memberId,
            email,
            role,
            phone,
            companyId,
            accessibleMenuIds,
          };
          setLoggedInUser(loggedInUser);
          onClose();
          nav('/main');
        } catch (error) {
          console.error('error', error);
        }
      },
      (err) => {
        console.error('err', err);
        return err?.response?.data;
      },
    );
  };

  async function requestNotificationPermission() {
    await Notification.requestPermission();
  }

  return (
    <div className="bg-whiten">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {t('Enter Authentication Code')}
        </h3>
      </div>
      <p className="pl-4 pt-2 text-sm text-primary">* Email : {email}</p>
      <p className="pl-4 pt-2 text-sm text-primary">
        * {t('Enter the Authentication Code sent by email')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5">
        <div className="relative h-25">
          <label htmlFor="authCode" className="label flex items-center gap-2">
            <span>{t('Authentication Code')}</span>
            {isActive && (
              <CountdownTimer
                reset={reset}
                isActive={isActive}
                setIsActive={setIsActive}
              />
            )}
          </label>
          <span className="icon-wrapper">
            <LockIcon />
          </span>
          <div className="grid grid-cols-12 gap-2">
            <Controller
              name="authCode"
              control={control}
              rules={validationRules.authCode}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  id="authCode"
                  placeholder={t('Enter your Authentication Code')}
                  className="input-style col-span-12 bg-white"
                />
              )}
            />
          </div>
          {errors.authCode && (
            <Error message={t(`${errors.authCode.message}`)} />
          )}
        </div>
        <button
          type="submit"
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-gradient-to-r from-e_green to-e_blue p-2 text-white hover:brightness-90"
        >
          {t('Log In')}
        </button>
      </form>
    </div>
  );
};

export default EnterAuthCode;
