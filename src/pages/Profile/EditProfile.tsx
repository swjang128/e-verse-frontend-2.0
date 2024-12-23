import React from 'react';
import { LoggedInUser } from '../../types/user';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import { t } from 'i18next';
import { useRecoilValue } from 'recoil';
import { selectLanguageState } from '../../store/selectLanguageAtom';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';

interface EditProfileProps {
  info: LoggedInUser | null;
  onSave: (updatedInfo: LoggedInUser) => void;
  onClose: () => void;
}

// FormValues는 LoggedInUser의 일부 속성들만을 사용
interface FormValues extends Pick<LoggedInUser, 'name' | 'email' | 'phone'> {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditProfile: React.FC<EditProfileProps> = ({ info, onSave, onClose }) => {
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const selectedLanguage = useRecoilValue(selectLanguageState);

  // Form Validation
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: info?.name,
      email: info?.email,
      phone: info?.phone,
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
        <h3 className="text-xl font-semibold text-black dark:text-white">
          {t('Profile Edit')}
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
              usableLanguages[selectedLanguage].name === 'Korea'
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

export default EditProfile;
