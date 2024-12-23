import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { AnomalyType } from '../ContentsWrapper/AnomalyDetectionDetailsContentsWrapper';
import { t } from 'i18next';

interface EditDetectionProps {
  info: AnomalyType;
  onSave: (updatedInfo: AnomalyType) => void;
  onClose: () => void;
}

// Form Validation 컴포넌트
function Error({ message }: { message: any }) {
  return (
    <p className="error-message error-message-orange pt-2 text-xs">{message}</p>
  );
}

const EditDetection: React.FC<EditDetectionProps> = ({
  info,
  onSave,
  onClose,
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [enabled, setEnabled] = useState<boolean>(info?.available);

  // Form Validation
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      companyId: loggedInUser?.companyId,
      anomalyId: info?.anomalyId,
      lowestHourlyEnergyUsage: info?.lowestHourlyEnergyUsage,
      highestHourlyEnergyUsage: info?.highestHourlyEnergyUsage,
      available: info?.available,
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
          {t('Anomaly Detection Setting Edit')}
        </h3>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-5"
      >
        <div className="w-full">
          <label className="mb-2.5 block font-semibold text-black dark:text-white">
            {t('Lowest Hourly Energy Usage')}
          </label>
          <Controller
            name="lowestHourlyEnergyUsage"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Enter Lowest Hourly Energy Usage',
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="lowestHourlyEnergyUsage"
                placeholder={t('Enter Lowest Hourly Energy Usage')}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            )}
          />
          {errors.lowestHourlyEnergyUsage && (
            <Error message={t(`${errors.lowestHourlyEnergyUsage.message}`)} />
          )}
        </div>

        <div className="w-full">
          <label className="mb-2.5 block font-semibold text-black dark:text-white">
            {t('Highest Hourly Energy Usage')}
          </label>
          <Controller
            name="highestHourlyEnergyUsage"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Enter Highest Hourly Energy Usage',
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="highestHourlyEnergyUsage"
                placeholder={t('Enter Highest Hourly Energy Usage')}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            )}
          />
          {errors.highestHourlyEnergyUsage && (
            <Error message={t(`${errors.highestHourlyEnergyUsage.message}`)} />
          )}
        </div>
        <div className="w-full">
          <label className="mb-2.5 block font-semibold text-black dark:text-white">
            {t('Available')}
          </label>
          <Controller
            name="available"
            control={control}
            render={({ field }) => (
              <div>
                <label
                  htmlFor="toggle"
                  className="flex cursor-pointer select-none items-center"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="sr-only"
                      onChange={() => {
                        setEnabled(!enabled);
                        setValue('available', !field.value);
                      }}
                    />
                    <div
                      className={`block h-8 w-14 rounded-full ${enabled ? 'bg-primary' : 'bg-zinc-300'}`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
                        enabled && '!right-1 !translate-x-full'
                      }`}
                    ></div>
                  </div>
                </label>
              </div>
            )}
          />
          {errors.available && (
            <Error message={t(`${errors.available.message}`)} />
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
export default EditDetection;
