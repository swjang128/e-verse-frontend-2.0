import React, { useEffect, useState } from 'react';
import { UserData } from '../../types/user';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import { t } from 'i18next';
import { useRecoilValue } from 'recoil';
import { selectLanguageState } from '../../store/selectLanguageAtom';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import queries from '../../hooks/queries/queries';
import { CompanyData } from '../../types/company';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { E_ROLE_TYPES } from '../../enum';

interface EditMemberProps {
  info: UserData;
  onSave: (updatedInfo: UserData | Omit<UserData, 'memberId'>) => void; // 'memberId' 필드 제외 가능
  onClose: () => void;
  mode: 'add' | 'edit';
}

// FormValues는 UserData의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    UserData,
    'memberId' | 'name' | 'email' | 'phone' | 'role' | 'companyId'
  > {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditMember: React.FC<EditMemberProps> = ({
  info,
  onSave,
  onClose,
  mode,
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const selectedLanguage = useRecoilValue(selectLanguageState);

  const { useCompanyList } = queries();
  const { data: companyListData } = useCompanyList();

  const [companyList, setCompanyList] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      memberId: info?.memberId,
      companyId: info.companyId,
      name: info?.name,
      email: info?.email,
      phone: info?.phone,
      role: info?.role,
    },
  });

  // companyList Setting
  useEffect(() => {
    if (companyListData) {
      setCompanyList(companyListData);
    }
  }, [companyListData]);

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {mode === 'add'
            ? t('Add Member')
            : `${info.name} ${t('Edit Member')}`}
        </h3>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-5"
      >
        <div className="w-full">
          <label className="mb-2.5 block font-semibold text-black dark:text-white">
            {t('Name')}
          </label>
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
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            )}
          />
          {errors.name && <Error message={t(`${errors.name.message}`)} />}
        </div>

        <div className="w-full">
          <label className="mb-2.5 block font-semibold text-black dark:text-white">
            {t('Email')}
          </label>
          <Controller
            name="email"
            control={control}
            rules={validationRules.email}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                name="email"
                placeholder={t('Enter your Email')}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            )}
          />
          {errors.email && <Error message={t(`${errors.email.message}`)} />}
        </div>

        <div className="w-full">
          <label className="mb-2.5 block font-semibold text-black dark:text-white">
            {t('Phone')}
          </label>
          <Controller
            name="phone"
            control={control}
            rules={
              loggedInUser?.role === 'ADMIN'
                ? validationRules.adminPhone
                : usableLanguages[selectedLanguage].name === 'Korea'
                  ? validationRules.phone.Korea
                  : usableLanguages[selectedLanguage].name === 'USA'
                    ? validationRules.phone.USA
                    : usableLanguages[selectedLanguage].name === 'Thailand'
                      ? validationRules.phone.Thailand
                      : usableLanguages[selectedLanguage].name === 'Vietnam'
                        ? validationRules.phone.Vietnam
                        : {}
            }
            render={({ field }) => (
              <input
                {...field}
                type="text"
                name="phone"
                placeholder={t('Enter your Phone Number')}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            )}
          />
          {errors.phone && <Error message={t(`${errors.phone.message}`)} />}
        </div>

        {loggedInUser?.role === E_ROLE_TYPES.ADMIN && (
          <div className="w-full">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              {t('Company')}
            </label>
            <Controller
              name="companyId"
              control={control}
              rules={validationRules.companyId}
              render={({ field }) => (
                <select
                  {...field}
                  name="companyId"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="" disabled className="">
                    {t('Choose your Company')}
                  </option>
                  {companyList.map((company: CompanyData) => (
                    <option key={company.companyId} value={company.companyId}>
                      {company.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.role && <Error message={t(`${errors.role.message}`)} />}
          </div>
        )}

        <div className="w-full">
          <label className="mb-2.5 block font-semibold text-black dark:text-white">
            {t('Role')}
          </label>
          <Controller
            name="role"
            control={control}
            rules={validationRules.role}
            render={({ field }) => (
              <select
                {...field}
                name="role"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              >
                <option value="" disabled className="">
                  {t('Choose your role')}
                </option>
                <option value="USER">USER</option>
                <option value="MANAGER">MANAGER</option>
              </select>
            )}
          />
          {errors.role && <Error message={t(`${errors.role.message}`)} />}
        </div>

        <button
          type="submit"
          className="mt-4 rounded bg-primary p-2 text-white"
        >
          {t('Button.Save')}
        </button>
      </form>
    </div>
  );
};

export default EditMember;
