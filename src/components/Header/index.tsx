import { Link } from 'react-router-dom';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import LogoIcon from '../../images/logo/logo-icon.png';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from '../../store/loggedInUserAtom';

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const loggedInUser = useRecoilValue(loggedInUserState);

  return (
    <header className="sticky top-0 z-99 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-3 py-3 shadow-2 md:px-8 2xl:px-11">
        <div className="hidden gap-5 font-semibold lg:flex">
          {/* <p className='flex gap-2 text-primary'><img src={iconFems} alt="icon" className='h-3 mt-1.5' /> FEMS</p>
          <p className='flex gap-2 text-secondary'><img src={iconPremium} alt="icon" className='h-4 mt-1' /> PREMIUM</p> */}
        </div>

        <div className="flex items-center gap-2 lg:hidden sm:gap-4">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-300'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && 'delay-400 !w-full'
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!w-full delay-500'
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-[0]'
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && '!h-0 !delay-200'
                  }`}
                ></span>
              </span>
            </span>
          </button>
          {/* <!-- Hamburger Toggle BTN --> */}

          <Link className="block flex-shrink-0 lg:hidden" to="/main">
            <img src={LogoIcon} alt="Logo" />
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <ul className="flex items-baseline gap-2">
            <li className="flex items-baseline gap-2 after:text-title-sm after:content-['|']">
              {loggedInUser?.companyType === 'FEMS' ? (
                <span className="xs:text-title-lg font-semibold text-primary sm:text-title-xl">
                  {loggedInUser?.companyType}
                </span>
              ) : (
                <span className="xs:text-title-lg font-semibold text-e_green sm:text-title-xl">
                  {loggedInUser?.companyType}
                </span>
              )}
            </li>
            <DropdownUser />
            <DropdownNotification />
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
