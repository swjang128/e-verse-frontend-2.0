import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import { t } from 'i18next';
import { CompanyData } from '../../types/company';
import queries from '../../hooks/queries/queries';
import { CountryData } from '../../types/country';
import { useRecoilValue } from 'recoil';
import { selectLanguageState } from '../../store/selectLanguageAtom';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
interface EditCompanyProps {
  info: CompanyData;
  onSave: (updatedInfo: CompanyData | Omit<CompanyData, 'memberId'>) => void; // 'memberId' 필드 제외 가능
  onClose: () => void;
  mode: 'add' | 'edit';
}

// FormValues는 CompanyData의 일부 속성들만을 사용
interface FormValues
  extends Pick<
    CompanyData,
    'companyId' | 'name' | 'email' | 'type' | 'tel' | 'fax' | 'address'
  > {
  countryId: number;
}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditCompany: React.FC<EditCompanyProps> = ({
  info,
  onSave,
  onClose,
  mode,
}) => {
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const selectedLanguage = useRecoilValue(selectLanguageState);
  const { useManageCountryList } = queries();
  const { data: countryListData, error, isLoading } = useManageCountryList();

  // 국가 데이터를 관리하는 상태
  const [countryList, setCountryList] = useState<CountryData[]>([]);

  useEffect(() => {
    if (countryListData) {
      setCountryList(countryListData);
    }
  }, [countryListData, countryList, setCountryList]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      companyId: info?.companyId,
      name: info?.name,
      email: info?.email,
      type: info?.type,
      countryId: info?.countryId || 1,
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
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {mode === 'add'
            ? t('Add Company')
            : `${info.name} ${t('Edit Company')}`}
        </h3>
      </div>
      <div>
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
                  placeholder={t(`Enter Company's Name`)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              )}
            />
            {errors.name && <Error message={t(`${errors.name.message}`)} />}
          </div>

          <div className="w-full">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              {t('Type')}
            </label>
            <Controller
              name="type"
              control={control}
              rules={validationRules.companyType}
              render={({ field }) => (
                <select
                  {...field}
                  name="type"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="" disabled className="">
                    {t(`Choose Company's Type`)}
                  </option>
                  <option value="FEMS">FEMS</option>
                  <option value="BEMS">BEMS</option>
                </select>
              )}
            />
            {errors.type && <Error message={t(`${errors.type.message}`)} />}
          </div>

          <div className="w-full">
            <label className="mb-2.5 block font-semibold text-black dark:text-white">
              {t('Country')}
            </label>
            <Controller
              name="countryId"
              control={control}
              rules={validationRules.countryId}
              render={({ field }) => (
                <select
                  {...field}
                  name="countryId"
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="" disabled className="">
                    {t(`Choose Company's Country`)}
                  </option>
                  {countryList &&
                    countryList.map((country: any) => {
                      return (
                        <option value={country.countryId}>
                          {country.name}
                        </option>
                      );
                    })}
                </select>
              )}
            />
            {errors.countryId && (
              <Error message={t(`${errors.countryId.message}`)} />
            )}
          </div>

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

export default EditCompany;
