import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoDark from '../../images/logo/logo_origin.png';
import back from '../../images/icon/back2.png';
import { postData } from '../../api'; // Axios를 이용한 API 호출 함수 가져오기
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import './auth.css';
import MailIcon from '../../path/MailIcon';
import LockIcon from '../../path/LockIcon';
import MemberIcon from '../../path/MemberIcon';
import BusinessIcon from '../../path/BusinessIcon';
import PhoneIcon from '../../path/PhoneIcon';
import { UserData } from '../../types/user';
import queries from '../../hooks/queries/queries';
import { t } from 'i18next';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { selectLanguageState } from '../../store/selectLanguageAtom';
import {
  usableCompaniesState,
  UsableCompaniesType,
} from '../../store/usableCompaniesAtom';
import {
  usableLanguagesState,
  UsableLanguagesType,
} from '../../store/usableLanguagesAtom';
import { E_ROLE_TYPES } from '../../enum';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { usableMenusState } from '../../store/usableMenusAtom';
import SimpleDropdownLanguage from '../../components/Header/SimpleDropdownLanguage';

// 폼 데이터의 타입 정의
interface FormValues
  extends Pick<
    UserData,
    | 'email'
    | 'name'
    | 'companyId'
    | 'phone'
    | 'password'
    | 'role'
    | 'accessibleMenuIds'
  > {
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const selectedLanguage = useRecoilValue(selectLanguageState);
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableMenus = useRecoilValue(usableMenusState);

  const resetLoggedInUser = useResetRecoilState(loggedInUserState);
  const resetUsableMenus = useResetRecoilState(usableMenusState);

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

  const nav = useNavigate();

  // Form Validation
  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      role: E_ROLE_TYPES.USER,
    },
  });

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

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    // confirmPassword 필드 삭제
    delete data.confirmPassword;

    // 이제 submitData를 서버로 보냅니다.
    return postData('/member', data).then(
      (res: any) => {
        nav('/auth/login');
      },
      (err) => {
        return err?.response?.data;
      },
    );
  };

  return (
    <>
      <div className="h-full w-full">
        <div className="flex h-full">
          <div className="relative hidden w-full bg-gradient-to-r from-e_green to-e_blue px-15 py-13 xl:block xl:w-3/5">
            <div className="flex flex-row items-center gap-4">
              <span>
                <img className="w-30 dark:hidden" src={LogoDark} alt="Logo" />
              </span>
              <span className="z-10 font-semibold text-white">
                <SimpleDropdownLanguage />
              </span>
            </div>
            <p className="absolute bottom-1/4 text-4xl leading-snug text-white opacity-60">
              {selectedLanguage === 'en-US' ? (
                <>
                  E-VERSE offers <br />
                  sustainable energy <br />
                  management and <br />
                  effective cost-saving <br />
                  solutions.
                </>
              ) : selectedLanguage === 'ko-KR' ? (
                <>
                  E-VERSE는 <br /> 지속 가능한 에너지 관리와 <br /> 효과적인
                  비용 절감 솔루션을 <br /> 제공합니다.
                </>
              ) : selectedLanguage === 'th-TH' ? (
                <>
                  E-VERSE <br />
                  นำเสนอการจัดการพลังงานที่ยั่งยืนและโซลูชั่นการประหยัดต้นทุนที่มีประสิทธิภาพ
                </>
              ) : selectedLanguage === 'vi-VN' ? (
                <>
                  Ưu đãi của E-VERSE <br />
                  năng lượng bền vững <br />
                  quản lý và <br />
                  tiết kiệm chi phí hiệu quả <br />
                  giải pháp.
                </>
              ) : (
                <></>
              )}
            </p>
            <div className="absolute right-0 top-0 h-full opacity-50">
              <img className="h-full" src={back} alt="Logo" />
            </div>
          </div>

          <div className="w-full border-stroke bg-whiten xl:w-2/5">
            <div className="w-full p-4 sm:p-12.5 xl:p-16">
              <h2 className="mb-1.5 text-2xl font-light text-black dark:text-white sm:text-title-xl2">
                {t('Sign up to E-VERSE')}
              </h2>

              <p className="mb-9 block font-light">
                {t('Start to cost-saving solutions.')}
              </p>

              {/* onSubmit을 handleSubmit 으로 감쌈 onSubmit하기 전에 handleSubmit 를 우선 작업 */}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                {/* email */}
                <div className="relative h-25">
                  <label htmlFor="email" className="label">
                    {t('Email')}
                  </label>
                  <span className="icon-wrapper">
                    <MailIcon />
                  </span>
                  <Controller
                    name="email"
                    control={control}
                    rules={validationRules.email}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="email"
                        placeholder={t('Enter a valid email address')}
                        className="input-style bg-white"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="error-message error-message-orange">
                      {t(`${errors.email.message}`)}
                    </p>
                  )}
                </div>

                {/* password */}
                <div className="relative h-25">
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      ...validationRules.password,
                      onChange: validationRules.password.onChange(() =>
                        trigger('confirmPassword'),
                      ),
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        id="password"
                        placeholder={t(
                          '6+ chars, 1 Upper, 1 Lower, 1 Number, 1 Special',
                        )}
                        className="input-style bg-white"
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
                    <p className="error-message error-message-orange">
                      {t(`${errors.password.message}`)}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative h-25">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      ...validationRules.confirmPassword,
                      validate: (value) =>
                        validationRules.confirmPassword.validate(
                          value,
                          getValues,
                        ),
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        id="confirmPassword"
                        placeholder={t(
                          '6+ chars, 1 Upper, 1 Lower, 1 Number, 1 Special',
                        )}
                        className="input-style bg-white"
                      />
                    )}
                  />
                  <label htmlFor="confirmPassword" className="label">
                    {t('Confirm Password')}
                  </label>
                  <span className="icon-wrapper">
                    <LockIcon />
                  </span>
                  {errors.confirmPassword && (
                    <p className="error-message error-message-orange">
                      {t(`${errors.confirmPassword.message}`)}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div className="relative h-25">
                  <span className="icon-wrapper">
                    <MemberIcon />
                  </span>
                  <Controller
                    name="name"
                    control={control}
                    rules={validationRules.name}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        id="name"
                        placeholder={t('Enter your name')}
                        className="input-style bg-white"
                      />
                    )}
                  />
                  <label htmlFor="name" className="label">
                    {t('Name')}
                  </label>
                  {errors.name && (
                    <p className="error-message error-message-orange">
                      {t(`${errors.name.message}`)}
                    </p>
                  )}
                </div>

                {/* Company */}
                <div className="relative h-25">
                  <Controller
                    name="companyId"
                    control={control}
                    rules={validationRules.companyId}
                    render={({ field }) => (
                      <select
                        {...field}
                        id="companyId"
                        className="input-style appearance-none bg-white"
                      >
                        <option value="">{t('Choose your Company')}</option>
                        {usableCompanies
                          .filter(
                            (company) =>
                              company.languageCode === selectedLanguage,
                          )
                          .map((company) => (
                            <option
                              key={company.companyId}
                              value={company.companyId}
                            >
                              {company.name}
                            </option>
                          ))}
                      </select>
                    )}
                  />
                  <label htmlFor="companyId" className="label">
                    {t('Company')}
                  </label>
                  <span className="icon-wrapper">
                    <BusinessIcon />
                  </span>
                  {errors.companyId && (
                    <p className="error-message error-message-orange">
                      {t(`${errors.companyId.message}`)}
                    </p>
                  )}
                </div>

                <div className="relative h-25">
                  <label htmlFor="phone" className="label">
                    {t('Phone')}
                  </label>
                  <span className="icon-wrapper">
                    <PhoneIcon />
                  </span>
                  <Controller
                    name="phone"
                    control={control}
                    rules={
                      usableLanguages[selectedLanguage].name === 'Korea'
                        ? validationRules.phone.Korea
                        : usableLanguages[selectedLanguage].name === 'USA'
                          ? validationRules.phone.USA
                          : usableLanguages[selectedLanguage].name ===
                              'Thailand'
                            ? validationRules.phone.Thailand
                            : usableLanguages[selectedLanguage].name ===
                                'Vietnam'
                              ? validationRules.phone.Vietnam
                              : {}
                    }
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder={t('Enter 10 or 11 digits (no dashes)')}
                        id="phone"
                        className="input-style bg-white"
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="error-message error-message-orange">
                      {t(`${errors.phone.message}`)}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <input
                    type="submit"
                    value={t('Sign Up')}
                    className="w-full cursor-pointer rounded-lg bg-gradient-to-r from-e_green to-e_blue p-4 text-white transition hover:drop-shadow"
                  />
                </div>

                <div className="mt-6 text-center">
                  <p>
                    {t('Already have an account?')}{' '}
                    <Link
                      to="/auth/login"
                      className="text-gray-200 font-medium underline hover:text-e_blue"
                    >
                      {t('Sign In')}
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
