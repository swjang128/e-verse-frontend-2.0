import Cookies from 'js-cookie';
import { getDecodedTokenExpDateGMT } from './tokenDecode';

const { HTTPS_USED } = import.meta.env;
const { hostname: HOST_NAME } = window.location;

const setTokenCookie = (tokenName: string, token: string) => {
  try {
    Cookies.set(tokenName, token, {
      domain: HOST_NAME,
      path: '/',
      expires: getDecodedTokenExpDateGMT(token),
      secure: HTTPS_USED,
      // sameSite: 'Strict', // 차후 도메인 적용시
    });
  } catch (error) {
    console.error('setToken ERROR', error);
  } finally {
    if (Cookies.get(tokenName) == undefined) {
      console.error(`${tokenName} setToken ERROR`);
    }
  }
};

export const setAccessTokenCookie = (token: string) => {
  return setTokenCookie('accessToken', token);
};

export const setRefreshTokenCookie = (token: string) => {
  return setTokenCookie('refreshToken', token);
};

const setExpireToken = (tokenName: string) => {
  Cookies.remove(tokenName, { path: '/' });
};

export const getAccessTokenCookie = () => {
  return Cookies.get('accessToken');
};

export const getRefreshTokenCookie = () => {
  return Cookies.get('refreshToken');
};

export const expireAccessTokenCookie = () => {
  return setExpireToken('accessToken');
};

export const expireRefreshTokenCookie = () => {
  return setExpireToken('refreshToken');
};

// 모든 토큰(cookie)과 session storage 초기화
export const expireAll = async () => {
  try {
    // 비동기 작업들을 배열에 담아 Promise.all()로 처리하여 모든 작업 완료 후 리다이렉트
    await Promise.allSettled([
      expireAccessTokenCookie(),
      expireRefreshTokenCookie(),
      (async () => {
        try {
          sessionStorage.clear();
        } catch (err) {
          console.error('Failed to clear session storage:', err);
        }
      })(),
    ]);

    // 모든 작업이 완료된 후 리턴
    console.log('expireAll', 'Success');
    return true;
  } catch (error) {
    console.log('expireAll', 'Error');
    console.error('Error during expireAll:', error);
    // 오류 발생 시 false 반환
    return false;
  }
};
