import React, { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { useRecoilState, useRecoilValue } from 'recoil';
import { loggedInUserState } from '../store/loggedInUserAtom';
import { getAccessTokenCookie } from '../cookies';
import { getDecodedToken } from '../tokenDecode';
import { LoggedInUser } from '../types/user';
import NotFound404 from '../pages/NotFound/NotFound404';

const DefaultLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const isAuthenticated = !!loggedInUser;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return isAuthenticated ? (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex w-full flex-1 flex-col overflow-y-auto overflow-x-hidden ">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="w-full px-3 py-3 md:px-8 2xl:px-11">{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  ) : (
    <NotFound404 />
  );
};

export default DefaultLayout;
