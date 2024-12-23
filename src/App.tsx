import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import LogIn from './pages/Authentication/LogIn';
import SignUp from './pages/Authentication/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile/Profile';
import DefaultLayout from './layout/DefaultLayout';
import Usage from './pages/Energy/Usage';
import Billing from './pages/Energy/Billing';
import Devices from './pages/Energy/Devices';
import Peak from './pages/Ai/Peak';
import Detection from './pages/Ai/Detection';
import Report from './pages/Ai/Report';
import Member from './pages/Management/Member';
import Subscription from './pages/Management/Subscription';
import './i18n';
import { useRecoilValue } from 'recoil';
import i18n from './i18n';
import { selectLanguageState } from './store/selectLanguageAtom';
import Company from './pages/Management/Company';
import ProtectedRoute from './AppProtectedRoute'; // AppProtectedRoute를 가독성을 위해 ProtectedRoute로 바꿔서 사용
import PublicRoute from './AppPublicRoute'; // AppPublicRoute를 가독성을 위해 PublicRoute로 바꿔서 사용
import NotFound404 from './pages/NotFound/NotFound404';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  const selectedLanguage = useRecoilValue(selectLanguageState);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
    i18n.changeLanguage(selectedLanguage);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div className={selectedLanguage === 'ko-KR' ? 'font-notoSansKR' : ''}>
      <Routes>
        {/* 인증되지 않은 사용자 접근 PublicRoute */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/auth/login"
          element={
            <PublicRoute>
              <>
                <PageTitle title="LogIn | E-VERSE V2.0" />
                <LogIn />
              </>
            </PublicRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <PublicRoute>
              <>
                <PageTitle title="Signup | E-VERSE V2.0" />
                <SignUp />
              </>
            </PublicRoute>
          }
        />
        <Route
          index
          path="/main"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Main | E-VERSE V2.0" />
                <Home />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        {/* ----------------------------------에너지 모니터링---------------------------------- */}
        <Route
          path="/energy/usage"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Energy usage | E-VERSE V2.0" />
                <Usage />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/energy/billing-overview"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Energy billing-overview | E-VERSE V2.0" />
                <Billing />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/energy/iot-devices"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Energy iot-devices | E-VERSE V2.0" />
                <Devices />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        {/* ----------------------------------AI 분석---------------------------------- */}
        <Route
          path="/ai/peak-management"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="AI peak-management | E-VERSE V2.0" />
                <Peak />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai/anomaly-detection"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="AI anomaly-detection | E-VERSE V2.0" />
                <Detection />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai/saving-report"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="AI saving-report | E-VERSE V2.0" />
                <Report />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        {/* ----------------------------------관리---------------------------------- */}
        <Route
          path="/management/company"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Management company | E-VERSE V2.0" />
                <Company />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/member"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Management member | E-VERSE V2.0" />
                <Member />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/management/usage-history"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Management usage-history | E-VERSE V2.0" />
                <Subscription />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        {/* ----------------------------------프로필---------------------------------- */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DefaultLayout>
                <PageTitle title="Profile | E-VERSE V2.0" />
                <Profile />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/404"
          element={
            <DefaultLayout>
              <PageTitle title="NotFound | E-VERSE V2.0" />
              <NotFound404 />
            </DefaultLayout>
          }
        />
        {/* ----------------------------------그 외의 처리---------------------------------- */}
        <Route path="/*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  );
}

export default App;
