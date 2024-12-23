import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/logo-expansiva.png';
import atemosLogo from '../../images/logo/main_logo_wh_width.png';
import back from '../../images/icon/back2.png';
import { Controller, useForm } from 'react-hook-form';
import {
  login,
  patchData,
  postAuthCodeData,
  resetPasswordData,
} from '../../api'; // Axios를 이용한 API 호출 함수 가져오기
import { setAccessTokenCookie, setRefreshTokenCookie } from '../../cookies';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { getDecodedToken } from '../../tokenDecode';
import { LoggedInUser, UserData } from '../../types/user';
import { validationRules } from '../../validationRules';
import MailIcon from '../../path/MailIcon';
import LockIcon from '../../path/LockIcon';
import SimpleDropdownLanguage from '../../components/Header/SimpleDropdownLanguage';
import {
  usableLanguagesState,
  UsableLanguagesType,
} from '../../store/usableLanguagesAtom';
import { selectLanguageState } from '../../store/selectLanguageAtom';
import { t } from 'i18next';
import Modal from '../../Modal';
import EnterAuthCode from './EnterAuthCode';
import queries from '../../hooks/queries/queries';
import {
  usableCompaniesState,
  UsableCompaniesType,
} from '../../store/usableCompaniesAtom';
import { usableMenusState } from '../../store/usableMenusAtom';
import UpdatePassword from '../Profile/UpdatePassword';
import ConfirmCancelModal from '../../components/ConfirmCancelModal';
import AuthUpdatePassword from './AuthUpdatePassword';
import AuthResetPassword from './AuthResetPassword';

// 폼 데이터의 타입 정의
interface FormValues extends Pick<UserData, 'email' | 'password'> {}
export interface PrimaryInput extends FormValues {
  countryId: number;
}

const LogIn: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const usableMenus = useRecoilValue(usableMenusState);
  const resetLoggedInUser = useResetRecoilState(loggedInUserState);
  const resetUsableMenus = useResetRecoilState(usableMenusState);
  const selectLanguage = useRecoilValue(selectLanguageState);
  const nav = useNavigate();

  // react-query
  const { useCountryList, useCompanyList } = queries();
  // listDatas
  const { data: countryListData, error, isLoading } = useCountryList();
  const { data: companyListData } = useCompanyList();

  // setDatas
  const [usableLanguages, setUsableLanguages] =
    useRecoilState<UsableLanguagesType>(usableLanguagesState);

  const [usableCompanies, setUsableCompanies] =
    useRecoilState<UsableCompaniesType>(usableCompaniesState);

  // 비밀번호 초기화
  const [pwUpdateModal, setPwUpdateModal] = useState(false);
  const [pwResetModal, setPwResetModal] = useState(false);

  // 비밀번호 수정
  const [updatPwdModal, setUpdatPwdModal] = useState(false);

  // countryList Setting
  useEffect(() => {
    if (countryListData) {
      setUsableLanguages(countryListData);
    }
  }, [countryListData, usableLanguages, setUsableLanguages]);

  // companyList Setting
  useEffect(() => {
    if (companyListData) {
      setUsableCompanies(companyListData);
    }
  }, [companyListData, usableCompanies, setUsableCompanies]);

  const [primaryInputData, setPrimaryInputData] = useState<PrimaryInput>();
  // 인증코드 입력모달
  const [editModal, setEditModal] = useState(false);
  // 인증번호 발송중
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // 강제 로그아웃 됐을 경우 recoil state가 남아있으므로 reset을 실행
    if (loggedInUser) {
      resetLoggedInUser();
    }
    if (usableMenus) {
      resetUsableMenus();
    }
  }, []);

  // Form Validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: any) => {
    if (selectLanguage === 'ko-KR') {
      setSending(true);
      // 한국에만 2Factor 적용 - 2Factor modal 출현
      setPrimaryInputData({
        ...data,
        countryId: usableLanguages[selectLanguage].countryId,
      });
      try {
        const response = await postAuthCodeData('/auth/2fa', {
          email: data.email,
        });
        if (response.status === 200 && response.data) {
          setEditModal(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setSending(false);
      }
    } else {
      requestNotificationPermission();
      const loginSubmitData = {
        ...data,
        countryId: usableLanguages[selectLanguage].countryId,
      };
      return login('/auth/login/no-2fa', loginSubmitData).then(
        // no-2fa : 2Factor 스킵
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
          } catch (error) {
            console.error('error', error);
          } finally {
            nav('/main');
          }
        },
        (err) => {
          console.error('err', err);
          return err?.response?.data;
        },
      );
    }
  };

  async function requestNotificationPermission() {
    await Notification.requestPermission();
  }

  // 비밀번호 수정
  const handlePwUpdate = async (updatedInfo: any) => {
    updatedInfo.password = updatedInfo.currentPassword;
    delete updatedInfo.currentPassword;
    delete updatedInfo.confirmNewPassword;
    try {
      await patchData(`/auth/update-password`, updatedInfo);
      setUpdatPwdModal(false);
    } catch (error) {
      console.error('Error while adding member:', error);
    }
  };

  // 비밀번호 초기화
  const handlePwReset = async (resetedInfo: any) => {
    try {
      await resetPasswordData(`/auth/reset-password`, resetedInfo);
      setPwResetModal(false);
    } catch (error) {
      console.error('Error while resetting password:', error);
    }
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-r from-e_green to-e_blue p-1 xl:p-10">
      <div className="relative z-50 flex h-full w-full items-center justify-center p-5 text-white">
        <div className="xs:w-1/2 lg:w-1/3">
          <div className="">
            <img className="mx-auto mb-10" src={LogoDark} alt="Logo" />
          </div>

          <div className="flex flex-col gap-1 pb-7">
            <div className="flex justify-center gap-2">
              <span className="text-l text-center font-bold">
                {t('Welcome')} !
              </span>
              <span className="text-center font-light opacity-80">
                {t('Sign in to continue to E-VERSE.')}
              </span>
            </div>
            <div className="text-l flex items-center justify-center gap-2 font-semibold">
              <span>{t('Choose the Language')}</span>
              <span>
                <SimpleDropdownLanguage />
              </span>
            </div>
          </div>

          {/* submitHandler을 handleSubmit 으로 감쌈 submitHandler하기 전에 handleSubmit 를 우선 작업 */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            {/* email */}
            <div className="relative h-25">
              <label htmlFor="email" className="label">
                {t('Email')}
              </label>
              <span className="icon-wrapper">
                <MailIcon fill="#ffffff" />
              </span>
              <Controller
                name="email"
                control={control}
                rules={validationRules.email}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    id="email"
                    placeholder={t('Enter a valid email address')}
                    className="input-style autoFill-custom placeholder-white placeholder-opacity-80 drop-shadow-md placeholder:font-light focus:border-white focus:outline-none"
                    autoComplete="username"
                  />
                )}
              />
              {errors.email && (
                <p className="error-message error-message-light">
                  {t(`${errors.email.message}`)}
                </p>
              )}
            </div>

            {/* password */}
            <div className="relative h-25">
              <Controller
                name="password"
                control={control}
                rules={validationRules.password}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    type="password"
                    id="password"
                    placeholder={t('Enter your password')}
                    className="input-style autoFill-custom placeholder-white placeholder-opacity-80 drop-shadow-md placeholder:font-light focus:border-white focus:outline-none"
                    autoComplete="current-password"
                  />
                )}
              />
              <label htmlFor="password" className="label">
                {t('Password')}
              </label>
              <span className="icon-wrapper">
                <LockIcon />
              </span>
              {errors.password && (
                <p className="error-message error-message-light">
                  {t(`${errors.password.message}`)}
                </p>
              )}
            </div>

            {editModal === false && (
              <div className="mb-10">
                <button
                  className={`flex w-full ${sending === false ? 'cursor-pointer bg-e_deepGreen hover:brightness-90' : 'cursor-not-allowed bg-slate-400'} items-center justify-center gap-2 rounded-lg  p-2 text-white drop-shadow-md`}
                >
                  {selectLanguage === 'ko-KR' ? (
                    <>{t('Authenticate')}</>
                  ) : (
                    <>{t('Log In')}</>
                  )}
                  {sending === true && (
                    <span className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-white border-t-transparent"></span>
                  )}
                </button>
              </div>
            )}

            <div className="grid gap-3">
              <div className="flex gap-2">
                <span className="font-extralight">
                  {t('Don’t have any account?')}
                </span>
                <Link
                  className="font-medium underline hover:text-e_deepGreen"
                  to="/auth/signup"
                >
                  {t('Sign Up')}
                </Link>
              </div>
              <div className="flex gap-2">
                <span className="font-extralight">
                  {t('Forgot your Password?')}
                </span>
                <span className="flex items-baseline gap-2 after:content-['/']">
                  <Link
                    className="font-medium underline hover:text-e_deepGreen"
                    onClick={() => setPwUpdateModal(true)}
                    to="#"
                  >
                    {t('Button.Edit')}
                  </Link>
                </span>
                <span>
                  <Link
                    className="font-medium underline hover:text-e_deepGreen"
                    to="#"
                    onClick={() => setPwResetModal(true)}
                  >
                    {t('Button.Reset')}
                  </Link>
                </span>
              </div>
            </div>
            <div className="flex gap-3"></div>
          </form>
        </div>
      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        {primaryInputData && (
          <EnterAuthCode
            primaryInputData={primaryInputData}
            onClose={() => setEditModal(false)}
          />
        )}
      </Modal>

      <Modal isOpen={pwUpdateModal} onClose={() => setPwUpdateModal(false)}>
        <AuthUpdatePassword
          onSave={handlePwUpdate}
          onClose={() => setPwUpdateModal(false)}
        />
      </Modal>

      <Modal isOpen={pwResetModal} onClose={() => setPwResetModal(false)}>
        <AuthResetPassword
          onSave={handlePwReset}
          onClose={() => setPwResetModal(false)}
        />
      </Modal>

      <div className="absolute bottom-0 right-1/2 z-50 translate-x-1/2 transform px-8 pb-4 lg:right-0 lg:transform-none">
        <img className="w-30" src={atemosLogo} alt="Logo" />
      </div>

      <div className="absolute right-0 top-0 hidden h-full opacity-50 xl:block">
        <img className="h-full" src={back} alt="Logo" />
      </div>
    </div>
  );
};

export default LogIn;
