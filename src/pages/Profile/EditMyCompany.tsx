import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import { t } from 'i18next';
import { CompanyData } from '../../types/company';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { selectLanguageState } from '../../store/selectLanguageAtom';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { E_ROLE_TYPES } from '../../enum';
interface EditMyCompanyProps {
  info: CompanyData;
  onSave: (updatedInfo: CompanyData | Omit<CompanyData, 'memberId'>) => void; // 'memberId' 필드 제외 가능
  onClose: () => void;
}

// FormValues는 CompanyData의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    CompanyData,
    'companyId' | 'name' | 'email' | 'tel' | 'fax' | 'address'
  > {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditMyCompany: React.FC<EditMyCompanyProps> = ({
  info,
  onSave,
  onClose,
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      companyId: info?.companyId,
      email: info?.email,
      tel: info?.tel,
      fax: info?.fax,
      address: info?.address,
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="">
      <div className="mb-2 border-b border-stroke px-5 py-4 dark:border-strokedark">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {t('Edit Company')}
        </h3>
      </div>
      {loggedInUser?.role === E_ROLE_TYPES.ADMIN ? (
        <p className="px-5">
          * {t('For more options, please use the Management Company menu.')}
        </p>
      ) : (
        <p className="px-5">
          *{' '}
          {t(
            'Please contact the Admin to modify CompanyName, CompanyType, and Country.',
          )}
        </p>
      )}
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-5"
        >
          <div className="col-span-6">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              {t('Address')}
            </label>
            <Controller
              name="address"
              control={control}
              rules={validationRules.address}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  name="address"
                  placeholder={t(`Enter Company's Address`)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              )}
            />
            {errors.address && (
              <Error message={t(`${errors.address.message}`)} />
            )}
          </div>

          <div className="col-span-6">
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
                  placeholder={t(`Enter Company's Email`)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              )}
            />
            {errors.email && <Error message={t(`${errors.email.message}`)} />}
          </div>

          <div className="col-span-6">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              {t('Tel')}
            </label>
            <Controller
              name="tel"
              control={control}
              rules={validationRules.tel}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  name="tel"
                  placeholder={t(`Enter Company's Tel number`)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              )}
            />
            {errors.tel && <Error message={t(`${errors.tel.message}`)} />}
          </div>

          <div className="col-span-6">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              {t('Fax')}
            </label>
            <Controller
              name="fax"
              control={control}
              rules={validationRules.fax}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  name="fax"
                  placeholder={t(`Enter Company's Fax number`)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              )}
            />
            {errors.fax && <Error message={t(`${errors.fax.message}`)} />}
          </div>

          <button
            type="submit"
            className="mt-4 rounded bg-primary p-2 text-white"
          >
            {t('Button.Save')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMyCompany;
