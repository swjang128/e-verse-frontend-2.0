import axios from 'axios';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { onRenewingState } from './store/onRenewingAtom';
import { useEffect } from 'react';
import {
  expireAll,
  getAccessTokenCookie,
  getRefreshTokenCookie,
  setAccessTokenCookie,
} from './cookies';

// 기본 API URL
const API_URL = `${import.meta.env.VITE_API_HOST}/atemos`;

// axios 인스턴스 생성
const axiosClient = axios.create({
  baseURL: API_URL, // API의 기본 URL
  withCredentials: true, // 쿠키를 포함하여 요청을 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

const AxiosClientProvider = () => {
  const [onRenewing, setOnRenewing] = useRecoilState(onRenewingState);
  let renewingCount = 0;

  useEffect(() => {
    const requestInterceptor = axiosClient.interceptors.request.use(
      (config) => {
        const accessToken = getAccessTokenCookie();
        // /auth/login 요청은 Authorization 헤더를 추가하지 않음
        if (
          !(
            (config.url === '/auth/login' && config.method === 'get') ||
            (config.url === '/auth/login' && config.method === 'post') ||
            (config.url === '/auth/login/no-2fa' && config.method === 'post') ||
            (config.url === '/member' && config.method === 'post')
          )
        ) {
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    const responseInterceptor = axiosClient.interceptors.response.use(
      (response) => {
        // POST /auth/login에 대한 응답이 200일 경우
        if (
          (response.config.url === '/auth/login' &&
            response.config.method === 'post') ||
          (response.config.url === '/auth/login/no-2fa' &&
            response.config.method === 'post')
        ) {
          if (response.status === 200 && response.data.data) {
            return response.data.data; // 후처리를 위해 post auth/login은 response.data.data 리턴함
          }
          // 타 에러 발생시 (500, 401) error handler에서 처리
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true; // 중복 요청 방지
          const { method, url } = originalRequest;

          if (
            (url === '/auth/login' && method === 'post') ||
            (url === '/auth/login/no-2fa' && method === 'post')
          ) {
            return Promise.reject(error);
          } else {
            // 401 에러 처리 (토큰 만료 시)
            if (!!getRefreshTokenCookie() === false) {
              // refreshToken 만료
              // 강제 로그아웃
              forcedLogout();
            } else {
              if (onRenewing === false && renewingCount === 0) {
                renewingCount++;
                setOnRenewing(true);
                const newAccessToken = await renewAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);
              }
            }
            // return Promise.reject(error);
          }
        }
      },
    );

    // 컴포넌트 언마운트 시 인터셉터 제거
    return () => {
      axiosClient.interceptors.request.eject(requestInterceptor);
      axiosClient.interceptors.response.eject(responseInterceptor);
    };
  }, [onRenewing, setOnRenewing, renewingCount]);

  const renewAccessToken = async () => {
    try {
      const refreshToken = getRefreshTokenCookie();
      const renewResponse = await axiosClient.post(
        `/auth/renew?refreshToken=${refreshToken}`,
      );
      const { accessToken } = renewResponse.data.data;
      setAccessTokenCookie(accessToken);
      renewingCount = 0;
      setOnRenewing(false);
      return accessToken;
    } catch (renewError) {
      // refreshToken 만료 외 다른 이슈
      console.error('Renew failed:', renewError);
      // 강제 로그아웃
      forcedLogout();
    }
  };

  const forcedLogout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (err) {
      console.warn('Logout request failed:', err);
    }
    await expireAll();
    window.location.href = '/auth/login';
  };

  return null;
};

export { axiosClient, AxiosClientProvider };
