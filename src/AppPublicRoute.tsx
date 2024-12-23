import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { loggedInUserState } from './store/loggedInUserAtom';

function AppPublicRoute({ children }: { children: JSX.Element }) {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const isAuthenticated = !!loggedInUser;

  return isAuthenticated ? <Navigate to="/main" replace /> : children;
}

export default AppPublicRoute;
