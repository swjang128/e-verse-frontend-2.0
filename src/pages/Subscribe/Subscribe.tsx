import { fetchData, postData } from '../../api';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { useRecoilState, useRecoilValue } from 'recoil';
import '../../css/react-big-calendar.css';
import { t } from 'i18next';
import { getCurrentDate } from '../../hooks/getStringedDate';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import SubscribeConfirmCancelModal from './SubscribeConfirmCancelModal';
import { LoggedInUser } from '../../types/user';
import { E_ROLE_TYPES } from '../../enum';

interface SubscribeProps {
  onClose: () => void;
}

const Subscribe = ({ onClose }: SubscribeProps) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const queryClient = useQueryClient();

  const [subscribeConfirmModal, setSubscribeConfirmModal] = useState(false);
  const onSubscribeConfirmPop = () => {
    setSubscribeConfirmModal(true);
  };

  const onSubscribe = async () => {
    if (loggedInUser) {
      const subscribeSubmitData = {
        companyId: loggedInUser?.companyId,
        service: 'AI_ENERGY_USAGE_FORECAST',
        startDate: getCurrentDate(usableLanguages),
      };
      try {
        await postData('/subscription', subscribeSubmitData);
      } catch (error) {
        console.error(error);
      } finally {
        queryClient.invalidateQueries({
          queryKey: ['subscription', loggedInUser?.companyId],
        });
        try {
          const renewAuthRoleInfoResponse = await fetchData('/auth/role');
          if (renewAuthRoleInfoResponse) {
            // 로그인 유저 Role 정보갱신
            // 그 외 개인정보는 갱신하지 않도록 함
            const renewloggedInUser: LoggedInUser = {
              ...loggedInUser,
              role: renewAuthRoleInfoResponse.data.role as E_ROLE_TYPES,
              accessibleMenuIds: renewAuthRoleInfoResponse.data
                .accessibleMenuIds as number[],
            };
            setLoggedInUser(renewloggedInUser);
          }
        } catch (error) {
        } finally {
          onClose();
        }
      }
    }
  };

  return (
    <>
      <div className="grid-rows grid border-4 border-orange-400">
        <div className="border-b border-stroke px-5 py-4 dark:border-strokedark ">
          <h3 className="text-title-lg font-semibold text-orange-500 dark:text-white">
            {t('Subscribe')}
          </h3>
        </div>

        <div className="bg-subscribe-custom-gradient pt-6">
          <div className="w-full px-5">
            <svg
              width="140"
              height="49"
              viewBox="0 0 140 49"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M94.3203 0L3.00017 0C1.34332 0 0.000167847 1.34315 0.000167847 3L0.000167847 41.8289L94.3203 41.8289L94.3203 0Z"
                fill="#FF8311"
              />
              <path
                d="M139.43 0H94.0719V41.9737H139.43L103.521 20.9868L139.43 0Z"
                fill="#FF8311"
              />
              <path d="M9.42969 49L0.429688 42H9.42969V49Z" fill="#FF8311" />
              <text
                x="13"
                y="28"
                fill="white"
                font-family="Arial, sans-serif"
                font-size="16"
                font-weight="bold"
              >
                Extended
              </text>
            </svg>
          </div>

          <div className="w-full px-5">
            <p className="rounded bg-gradient-to-r from-e_orange to-e_blue py-2 text-center text-title-md text-white">
              {t('Expand your use of AI and equipment further.')}
            </p>
          </div>

          <div className="my-10 w-full">
            <div className="flex items-baseline justify-center gap-4">
              <span className="text-gray-800 text-5xl font-bold text-black">
                $ 0.24 (¢ 24)
              </span>
              <span className="text-gray-500 block">{t('Per Daily')}</span>
            </div>
          </div>

          <div className="mb-10 w-full px-5">
            <ul className="text-gray-600 space-y-4">
              <li className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414 0L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <p className="font-semibold text-orange-500">
                  {t(
                    'AI Analytics (Peak Management, Anomaly Detection, Saving Report)',
                  )}
                </p>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414 0L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <p className="font-semibold text-orange-500">
                  {t('AI Chatbot Available')}
                </p>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414 0L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <p className="font-semibold text-orange-500">
                  {t('Maximum Storage : 50 GB')}
                </p>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-orange-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414 0L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 000-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <p className="font-semibold text-orange-500">
                  {t('Maximum IoT Devices : 10 units')}
                </p>
              </li>
            </ul>
          </div>

          <div className="w-full px-5 text-red-700">
            *{' '}
            {t(
              'If you cancel your subscription on the same day, it will remain in effect until the same day.',
            )}
          </div>

          <div className="my-4 flex w-full justify-center gap-2">
            <button
              className="cursor-pointer rounded border border-orange-300 bg-white px-5 py-1.5 text-orange-500 transition hover:bg-orange-500 hover:text-white"
              onClick={onSubscribeConfirmPop}
            >
              {t('Button.Confirm')}
            </button>
            <button
              className="cursor-pointer rounded border border-orange-100 bg-gray px-5 py-1.5 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
              onClick={onClose}
            >
              {t('Button.Close')}
            </button>
          </div>
        </div>
      </div>
      <SubscribeConfirmCancelModal
        isOpen={subscribeConfirmModal}
        onClose={() => setSubscribeConfirmModal(false)}
        onConfirm={onSubscribe}
        title={t('Subscribe Confirm')}
        message={t('Do you want to Subscribe?')}
      />
    </>
  );
};

export default Subscribe;
