import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { validationRules } from '../../validationRules';
import { LoggedInUser } from '../../types/user';
import { t } from 'i18next';
import MailIcon from '../../path/MailIcon';

interface AuthResetPasswordProps {
  onSave: (passwords: { password: string; newPassword: string }) => void;
  onClose: () => void;
}

// FormValues는 LoggedInUser의 일부 속성들만을 사용
interface FormValues extends Pick<LoggedInUser, 'email'> {}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const AuthResetPassword: React.FC<AuthResetPasswordProps> = ({
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
          {t('Reset Password')}
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

export default AuthResetPassword;
