import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import { t } from 'i18next';
import queries from '../../hooks/queries/queries';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import { readSystemNotificationData } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { SystemNotificationData } from '../../types/systemNotification';
import { getCurrentDateDetails } from '../../hooks/getStringedDate';

const DropdownNotification = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const queryClient = useQueryClient();
  const { useSystemNotificationList } = queries();
  const {
    data: systemNotificationListData,
    error,
    isLoading,
  } = useSystemNotificationList(loggedInUser?.companyId || 0, usableLanguages);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newSystemNotifications, setNewSystemNotifications] = useState<
    SystemNotificationData[]
  >([]);
  const [notifications, setNotifications] = useState<SystemNotificationData[]>(
    [],
  );
  const [currentDateTime, setCurrentDateTime] = useState<Date>();

  useEffect(() => {
    setCurrentDateTime(
      new Date(
        `${getCurrentDateDetails(usableLanguages).date.fullDate}T${getCurrentDateDetails(usableLanguages).time}`,
      ),
    );
  }, []);

  useEffect(() => {
    if (systemNotificationListData && currentDateTime) {
      try {
        const sortedSystemNotificationsList = systemNotificationListData
          .map((notifications: SystemNotificationData) => {
            return {
              ...notifications,
              isRead:
                notifications.isRead === true
                  ? notifications.isRead // 이미 읽은 알람은 읽음 처리
                  : new Date(notifications.createdDate) < currentDateTime, // 현재 이전 알람들은 자동 읽음 처리
            };
          })
          .sort(
            (a: SystemNotificationData, b: SystemNotificationData) =>
              b.alarmId - a.alarmId,
          );
        setNotifications(sortedSystemNotificationsList);
        setNewSystemNotifications(
          sortedSystemNotificationsList.filter(
            (notification: any) => notification.isRead === false,
          ),
        );
      } catch (error) {
        console.error('Notification polling Error : ', error);
      }
    }
  }, [systemNotificationListData]);

  useEffect(() => {
    if (newSystemNotifications) {
      const titleAlarm = newSystemNotifications[0];
      if (titleAlarm !== undefined) {
        new Notification('E-VERSE Notification', {
          body: `${moment(titleAlarm?.createdDate).format(
            'YYYY-MM-DD HH:mm:ss',
          )} ${titleAlarm?.message} (${loggedInUser?.companyName})`,
        });
      }
    }
  }, [newSystemNotifications]);

  const markAsRead = async (alarmId: number, isRead: boolean) => {
    if (isRead === true) {
      // showToast({ message: '이미 읽은 알람입니다.', type: ToastType.ERROR });
      return;
    } else {
      await readSystemNotificationData(`/alarm/${alarmId}`, {
        isRead: true,
      });
      queryClient.invalidateQueries({
        queryKey: ['systemNotificationList'],
      });
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <li>
        <Link
          onClick={() => {
            setDropdownOpen(!dropdownOpen);
          }}
          to="#"
          className="relative ml-1 flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        >
          <span
            className={`absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1 ${
              newSystemNotifications.length > 0 ? 'inline' : 'hidden'
            }`}
          >
            <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
          </span>

          <svg
            className="fill-current duration-300 ease-in-out"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.1999 14.9343L15.6374 14.0624C15.5249 13.8937 15.4687 13.7249 15.4687 13.528V7.67803C15.4687 6.01865 14.7655 4.47178 13.4718 3.31865C12.4312 2.39053 11.0812 1.7999 9.64678 1.6874V1.1249C9.64678 0.787402 9.36553 0.478027 8.9999 0.478027C8.6624 0.478027 8.35303 0.759277 8.35303 1.1249V1.65928C8.29678 1.65928 8.24053 1.65928 8.18428 1.6874C4.92178 2.05303 2.4749 4.66865 2.4749 7.79053V13.528C2.44678 13.8093 2.39053 13.9499 2.33428 14.0343L1.7999 14.9343C1.63115 15.2155 1.63115 15.553 1.7999 15.8343C1.96865 16.0874 2.2499 16.2562 2.55928 16.2562H8.38115V16.8749C8.38115 17.2124 8.6624 17.5218 9.02803 17.5218C9.36553 17.5218 9.6749 17.2405 9.6749 16.8749V16.2562H15.4687C15.778 16.2562 16.0593 16.0874 16.228 15.8343C16.3968 15.553 16.3968 15.2155 16.1999 14.9343ZM3.23428 14.9905L3.43115 14.653C3.5999 14.3718 3.68428 14.0343 3.74053 13.6405V7.79053C3.74053 5.31553 5.70928 3.23428 8.3249 2.95303C9.92803 2.78428 11.503 3.2624 12.6562 4.2749C13.6687 5.1749 14.2312 6.38428 14.2312 7.67803V13.528C14.2312 13.9499 14.3437 14.3437 14.5968 14.7374L14.7655 14.9905H3.23428Z"
              fill=""
            />
          </svg>
        </Link>

        {dropdownOpen && (
          <div
            className={`absolute right-0 mt-2.5 flex h-90 w-75 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark sm:w-80`}
          >
            <div className="px-4 py-3">
              <h3 className="text-lg font-semibold text-black">
                {t('Notification')}
              </h3>
            </div>

            <ul className="flex h-auto flex-col overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification: any) => (
                  <li
                    key={notification.alarmId}
                    onClick={() => {
                      markAsRead(notification.alarmId, notification.isRead);
                    }}
                    className={`border-t border-stroke px-4 py-3 text-sm hover:bg-gray-2 dark:border-strokedark ${
                      notification.isRead
                        ? 'bg-gray dark:bg-meta-4 '
                        : 'dark:bg-boxdark'
                    }`}
                  >
                    <div className="grid cursor-pointer gap-2 border-stroke py-3 hover:bg-gray-2 dark:border-strokedark dark:hover:bg-meta-4">
                      <p className="text-black dark:text-white">
                        {moment(notification.createdDate).format(
                          'YYYY-MM-DD HH:mm:ss',
                        )}
                      </p>
                      <p className="text-red-500">{notification.message} </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-4 text-sm">
                  {t('No Notificaitions Have Been Received.')}
                </li>
              )}
            </ul>
          </div>
        )}
      </li>
    </ClickOutside>
  );
};

export default DropdownNotification;
