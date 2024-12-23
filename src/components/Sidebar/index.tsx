import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo_version.png';
import atemos_logo from '../../images/logo/main_logo_wh_width.png';
import icon_energy from '../../images/icon/icon-energy.png';
import icon_facility from '../../images/icon/icon-facility.png';
import icon_management from '../../images/icon/icon-management.png';
import { t } from 'i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import { usableMenusState, UsableMenusType } from '../../store/usableMenusAtom';
import { loggedInUserState } from '../../store/loggedInUserAtom';
import queries from '../../hooks/queries/queries';
import { useQueryClient } from '@tanstack/react-query';
import { fetchData, patchData } from '../../api';
import { usableLanguagesState } from '../../store/usableLanguagesAtom';
import SubscribeModal from '../../pages/Subscribe/SubscribeModal';
import UnsubscribeConfirmCancelModal from '../../pages/Subscribe/UnsubscribeConfirmCancelModal';
import Subscribe from '../../pages/Subscribe/Subscribe';
import { getCurrentDate } from '../../hooks/getStringedDate';
import { showToast, ToastType } from '../../ToastContainer';
import { E_ROLE_TYPES, E_SUBSCRIPTION_STATUS_TYPES } from '../../enum';
import { LoggedInUser } from '../../types/user';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const nav = useNavigate();
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const usableLanguages = useRecoilValue(usableLanguagesState);
  const queryClient = useQueryClient();

  const { useMenuList, useSubscription } = queries();
  const { data: menuListData } = useMenuList();
  const { data: subscriptionListData } = useSubscription(
    loggedInUser?.companyId || 0,
  );
  const [usableMenus, setUsableMenus] =
    useRecoilState<UsableMenusType>(usableMenusState);
  const [userAccessibleMenus, setUserAccessibleMenus] = useState<any>([]);

  // 구독 여부
  // true false 만으로는 처리할 수 없는 부분이 있어 (당일 구독취소 flag) string으로 변경
  // subscribed = 구독중, canceled = (당일 구독취소)구독취소중, unsubscribed = 구독취소 완료
  // S, C, U
  const [isSubscribed, setIsSubscribed] = useState<E_SUBSCRIPTION_STATUS_TYPES>(
    E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED,
  ); // 기본 U

  // 구독하기 팝업
  const [subscribePopModal, setSubscribePopModal] = useState(false);
  // 구독취소 팝업
  const [unsubscribePopModal, setUnsubscribePopModal] = useState(false);

  // isSubscribed
  useEffect(() => {
    if (
      subscriptionListData &&
      subscriptionListData.length > 0 &&
      subscriptionListData.find(
        (item: any) => item.service === 'AI_ENERGY_USAGE_FORECAST',
      )
    ) {
      subscriptionListData.sort(
        (a: any, b: any) => b.subscriptionId - a.subscriptionId,
      );
      if (subscriptionListData[0].endDate === undefined) {
        setIsSubscribed(E_SUBSCRIPTION_STATUS_TYPES.SUBSCRIBED); // 구독중
      } else if (
        subscriptionListData[0].endDate === getCurrentDate(usableLanguages)
      ) {
        setIsSubscribed(E_SUBSCRIPTION_STATUS_TYPES.CANCELED); // 당일 구독취소 : Canceled
      }
    } else {
      setIsSubscribed(E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED); // 구독취소 완료
    }
  }, [subscriptionListData]);

  // auth role 갱신
  // 새로고침 할때마다 auth/role 호출
  // 새로고침 할때마다 가져와야 하므로 react-query 쓰지 않음
  useEffect(() => {
    const getAuthRoleInfo = async () => {
      if (loggedInUser) {
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
      }
    };
    getAuthRoleInfo();
  }, []);

  // menuList Setting
  // 1. 처음에 한번 로딩
  // 2. 구독 정보가 변경되었을 때 = (loggedInUser 데이터가 변경되었을 때) 갱신
  useEffect(() => {
    if (
      menuListData &&
      loggedInUser?.accessibleMenuIds &&
      subscriptionListData
    ) {
      const accessibleMenuIds = loggedInUser?.accessibleMenuIds;
      const filteredMenuListData = menuListData
        .map((menus: any) => {
          if (menus.menuId !== 1 && accessibleMenuIds.includes(menus.menuId)) {
            return menus;
          }
        })
        .filter((menu: any) => menu !== undefined);
      if (
        loggedInUser?.role === E_ROLE_TYPES.MANAGER &&
        isSubscribed === E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED
      ) {
        filteredMenuListData.push({
          menuId: 3,
          name: 'AI Analytics',
          url: '/ai',
          children: [
            {
              menuId: 8,
              name: 'Peak Management',
              url: '/ai/peak-management',
              parentId: 3,
            },
            {
              menuId: 9,
              name: 'Anomaly Detection',
              url: '/ai/anomaly-detection',
              parentId: 3,
            },
            {
              menuId: 10,
              name: 'Saving Report',
              url: '/ai/saving-report',
              parentId: 3,
            },
          ],
        });
        filteredMenuListData.sort((a: any, b: any) => a.menuId - b.menuId);
      }
      setUserAccessibleMenus(filteredMenuListData);

      // filteredMenuListData를 usableMenus RecoilVaue와 sessionStorage에도 셋팅
      setUsableMenus(filteredMenuListData);
    }
  }, [
    menuListData,
    loggedInUser,
    subscriptionListData,
    isSubscribed,
    setUserAccessibleMenus,
  ]);

  const location = useLocation();
  const { pathname } = location;
  const parentUri = pathname.split('/')[1];

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const onUnsubscribe = async () => {
    subscriptionListData.sort(
      (a: any, b: any) => b.subscriptionId - a.subscriptionId,
    );
    const subscriptionId = subscriptionListData[0].subscriptionId;
    try {
      await patchData(`/subscription/cancel/${subscriptionId}`, {});
    } catch (error) {
      console.error(error);
    } finally {
      queryClient.invalidateQueries({
        queryKey: ['subscription', loggedInUser?.companyId],
      });
      try {
        const newAuthInfoResponse = await fetchData('/auth/info');
        if (newAuthInfoResponse) {
          // 로그인 유저 정보갱신
          setLoggedInUser(newAuthInfoResponse.data);
        }
      } catch (error) {
      } finally {
        setUnsubscribePopModal(false);
        nav('/main');
        // window.location.href = '/';
      }
    }
  };

  return (
    <>
      <aside
        ref={sidebar}
        className={`... absolute left-0 top-0 z-9999 flex h-screen w-70 flex-col overflow-y-hidden bg-gradient-to-b from-[#01001F] to-[#02004A] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-10 py-5.5 lg:py-6.5">
          <NavLink to="/main">
            <img src={Logo} alt="Logo" />
          </NavLink>

          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            <div>
              {userAccessibleMenus && (
                <ul className="mb-6 flex flex-col gap-1.5">
                  {userAccessibleMenus &&
                    userAccessibleMenus.map((userAccessibleMenu: any) => {
                      const userAccessibleMenuParentUri =
                        userAccessibleMenu.url.split('/')[1];
                      return (
                        <SidebarLinkGroup
                          activeCondition={
                            parentUri === userAccessibleMenuParentUri
                          }
                        >
                          {(handleClick, open) => {
                            return (
                              <React.Fragment>
                                <NavLink
                                  to="#"
                                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                                    parentUri === userAccessibleMenuParentUri &&
                                    'bg-graydark dark:bg-meta-4'
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const target = e.target as HTMLElement;
                                    const parent =
                                      target.parentNode as HTMLElement;
                                    const siblings = Array.from(
                                      parent.children,
                                    ); // 자식 요소 배열로 변환
                                    const firstSibling = siblings.find(
                                      (child) => child !== target,
                                    ) as HTMLInputElement; // 자기 자신이 아닌 첫 번째 형제 찾기
                                    if (
                                      firstSibling &&
                                      firstSibling.id ===
                                        'subscriptionToggleButton' &&
                                      firstSibling.type === 'checkbox'
                                    ) {
                                      e.stopPropagation();
                                      if (
                                        isSubscribed ===
                                        E_SUBSCRIPTION_STATUS_TYPES.SUBSCRIBED
                                      ) {
                                        setUnsubscribePopModal(true);
                                      } else if (
                                        isSubscribed ===
                                        E_SUBSCRIPTION_STATUS_TYPES.CANCELED
                                      ) {
                                        showToast({
                                          message: t(
                                            'It is being canceled. You can use it until today.',
                                          ),
                                          type: ToastType.WARNING,
                                        });
                                      } else if (
                                        isSubscribed ===
                                        E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED
                                      ) {
                                        setSubscribePopModal(true);
                                      }
                                      return;
                                    } else {
                                      sidebarExpanded
                                        ? handleClick()
                                        : setSidebarExpanded(true);
                                    }
                                  }}
                                >
                                  <p className="w-5">
                                    <img
                                      src={
                                        userAccessibleMenuParentUri === 'energy'
                                          ? icon_energy
                                          : userAccessibleMenuParentUri === 'ai'
                                            ? icon_facility
                                            : userAccessibleMenuParentUri ===
                                                'management'
                                              ? icon_management
                                              : ''
                                      }
                                      alt=""
                                      className="w-[21px]"
                                    />
                                  </p>
                                  {t(userAccessibleMenu.name)}
                                  {loggedInUser?.role ===
                                    E_ROLE_TYPES.MANAGER &&
                                    userAccessibleMenu.menuId === 3 && (
                                      <div className="absolute right-10 top-1/2 -translate-y-1/2 fill-current">
                                        <label
                                          htmlFor="toggle"
                                          className="flex cursor-pointer select-none items-center"
                                        >
                                          <div className="relative">
                                            <input
                                              type="checkbox"
                                              id="subscriptionToggleButton"
                                              className="sr-only"
                                            />
                                            <div
                                              className={`block h-6 w-10 rounded-full ${isSubscribed === E_SUBSCRIPTION_STATUS_TYPES.SUBSCRIBED ? 'bg-primary' : isSubscribed === E_SUBSCRIPTION_STATUS_TYPES.CANCELED ? 'bg-orange-500' : isSubscribed === E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED ? 'bg-zinc-300' : ''}`}
                                            ></div>
                                            {isSubscribed ===
                                            E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED ? (
                                              <div className="absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition"></div>
                                            ) : (
                                              <div className="absolute !right-1 left-1 top-1 flex h-4 w-4 !translate-x-full items-center justify-center rounded-full bg-white transition"></div>
                                            )}
                                          </div>
                                        </label>
                                      </div>
                                    )}
                                  <svg
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                                      open && 'rotate-180'
                                    }`}
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                      fill=""
                                    />
                                  </svg>
                                </NavLink>
                                <div
                                  className={`translate transform overflow-hidden ${
                                    !open && 'hidden'
                                  }`}
                                >
                                  <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                                    {userAccessibleMenu.children &&
                                      userAccessibleMenu.children.map(
                                        (menuChildren: any) => {
                                          const accessibleMenuIds =
                                            loggedInUser?.accessibleMenuIds;
                                          if (
                                            loggedInUser?.role !==
                                              E_ROLE_TYPES.ADMIN &&
                                            isSubscribed ===
                                              E_SUBSCRIPTION_STATUS_TYPES.UNSUBSCRIBED &&
                                            userAccessibleMenu.menuId === 3
                                          ) {
                                            return (
                                              <li className="group relative flex cursor-context-menu items-center gap-2.5 rounded-md px-5.5 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white">
                                                {t(menuChildren.name)}
                                              </li>
                                            );
                                          } else {
                                            if (
                                              accessibleMenuIds?.includes(
                                                menuChildren.menuId,
                                              )
                                            ) {
                                              return (
                                                <li>
                                                  <NavLink
                                                    to={menuChildren.url}
                                                    className={({ isActive }) =>
                                                      'group relative flex items-center gap-2.5 rounded-md px-5.5 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                                      (isActive &&
                                                        '!text-white')
                                                    }
                                                  >
                                                    {t(menuChildren.name)}
                                                  </NavLink>
                                                </li>
                                              );
                                            }
                                          }
                                        },
                                      )}
                                  </ul>
                                </div>
                              </React.Fragment>
                            );
                          }}
                        </SidebarLinkGroup>
                      );
                    })}
                </ul>
              )}
            </div>
          </nav>
        </div>

        {/* contact */}
        <div className="absolute bottom-0 left-0 bg-[#02004A] px-10 py-6 text-white">
          {/* <img src={icon_contact} alt="logo" className="w-10" /> */}
          <img src={atemos_logo} alt="logo" className="mb-0.5 w-20" />
          <p className="text-[12px] font-extralight">
            © 2024 Atemos. All rights reserved.
          </p>
        </div>
        {/* contact */}
      </aside>

      <SubscribeModal
        isOpen={subscribePopModal}
        onClose={() => setSubscribePopModal(false)}
      >
        <Subscribe onClose={() => setSubscribePopModal(false)}></Subscribe>
      </SubscribeModal>
      <UnsubscribeConfirmCancelModal
        isOpen={unsubscribePopModal}
        onClose={() => setUnsubscribePopModal(false)}
        onConfirm={onUnsubscribe}
        title={t('Unsubscribe')}
        message={t('Would you like to Unsubscribe?')}
      ></UnsubscribeConfirmCancelModal>
    </>
  );
};

export default Sidebar;
