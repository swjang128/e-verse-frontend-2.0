import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import { LoggedInUser } from '../../types/user';
import { t } from 'i18next';

interface UpdatePasswordProps {
  info: LoggedInUser | null;
  onSave: (passwords: { password: string; newPassword: string }) => void;
  onClose: () => void;
}

// FormValues는 LoggedInUser의 일부 속성들만을 사용
interface FormValues extends Pick<LoggedInUser, 'email'> {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const UpdatePassword: React.FC<UpdatePasswordProps> = ({
  info,
  onSave,
  onClose,
}) => {
  // Form Validation
  const {
    control,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: info?.email,
      password: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div>
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          {t('Update Password')}
        </h3>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-5"
      >
        <div>
          <label
            htmlFor="password"
            className="mb-2.5 block font-semibold text-black dark:text-white"
          >
            {t('Current Password')}
          </label>
          <Controller
            name="password"
            control={control}
            rules={validationRules.password}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                name="password"
                placeholder={t('Enter your current password')}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            )}
          />
          {errors.password && (
            <Error message={t(`${errors.password.message}`)} />
          )}
        </div>
        <div>
          <label
            htmlFor="newPassword"
            className="mb-2.5 block font-semibold text-black dark:text-white"
          >
            {t('New Password')}
          </label>
          <Controller
            name="newPassword"
            control={control}
            rules={{
              ...validationRules.newPassword,
              onChange: validationRules.newPassword.onChange(() =>
                trigger('confirmNewPassword'),
              ),
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                name="newPassword"
                placeholder={t('Enter your new password')}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            )}
          />
          {errors.newPassword && (
            <Error message={t(`${errors.newPassword.message}`)} />
          )}
        </div>
        <div>
          <label
            htmlFor="confirmNewPassword"
            className="mb-2.5 block font-semibold text-black dark:text-white"
          >
            {t('Confirm New Password')}
          </label>
          <Controller
            name="confirmNewPassword"
            control={control}
            rules={{
              ...validationRules.confirmNewPassword,
              validate: (value) =>
                validationRules.confirmNewPassword.validate(value, getValues),
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                name="confirmNewPassword"
                placeholder={t('Enter your new password one more time')}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            )}
          />
          {errors.confirmNewPassword && (
            <Error message={t(`${errors.confirmNewPassword.message}`)} />
          )}
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

export default UpdatePassword;
