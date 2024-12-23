import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import { LoggedInUser } from '../../types/user';
import { t } from 'i18next';
import MailIcon from '../../path/MailIcon';
import LockIcon from '../../path/LockIcon';

interface AuthUpdatePasswordProps {
  onSave: (passwords: { password: string; newPassword: string }) => void;
  onClose: () => void;
}

// FormValues는 LoggedInUser의 일부 속성들만을 사용
interface FormValues extends Pick<LoggedInUser, 'email'> {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const AuthUpdatePassword: React.FC<AuthUpdatePasswordProps> = ({
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
      email: '',
      currentPassword: '',
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
    <div className="bg-whiten">
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          {t('Update Password')}
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5">
        <div className="relative h-25">
          <label htmlFor="email" className="label flex items-center gap-2">
            <span>{t('Email')}</span>
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
                name="email"
                placeholder={t('Enter your Email')}
                className="input-style col-span-12 bg-white"
              />
            )}
          />
          {errors.email && <Error message={t(`${errors.email.message}`)} />}
        </div>
        <div className="relative h-25">
          <label htmlFor="password" className="label flex items-center gap-2">
            <span>{t('Current Password')}</span>
          </label>
          <span className="icon-wrapper">
            <LockIcon />
          </span>
          <Controller
            name="currentPassword"
            control={control}
            rules={validationRules.currentPassword}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                name="currentPassword"
                placeholder={t('Enter your current password')}
                className="input-style col-span-12 bg-white"
              />
            )}
          />
          {errors.currentPassword && (
            <Error message={t(`${errors.currentPassword.message}`)} />
          )}
        </div>
        <div className="relative h-25">
          <label
            htmlFor="newPassword"
            className="label flex items-center gap-2"
          >
            <span>{t('New Password')}</span>
          </label>
          <span className="icon-wrapper">
            <LockIcon />
          </span>
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
                className="input-style col-span-12 bg-white"
              />
            )}
          />
          {errors.newPassword && (
            <Error message={t(`${errors.newPassword.message}`)} />
          )}
        </div>
        <div className="relative h-25">
          <label
            htmlFor="confirmNewPassword"
            className="label flex items-center gap-2"
          >
            <span>{t('Confirm New Password')}</span>
          </label>
          <span className="icon-wrapper">
            <LockIcon />
          </span>
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
                className="input-style col-span-12 bg-white"
              />
            )}
          />
          {errors.confirmNewPassword && (
            <Error message={t(`${errors.confirmNewPassword.message}`)} />
          )}
        </div>
        <button
          type="submit"
          className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded bg-gradient-to-r from-e_green to-e_blue p-2 text-white hover:brightness-90"
        >
          {t('Button.Confirm')}
        </button>
      </form>
    </div>
  );
};

export default AuthUpdatePassword;
