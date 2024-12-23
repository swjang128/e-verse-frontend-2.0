import { jwtDecode } from 'jwt-decode';

export const getDecodedToken = (token: string) => {
  return jwtDecode(token);
};

export const getDecodedTokenExpDate = (token: string) => {
  const decodedToken = getDecodedToken(token);
  const expiresInMillis = (decodedToken.exp || 0) * 1000;
  const expirationDate = new Date(expiresInMillis);
  return expirationDate;
};

export const getDecodedTokenExpDateGMT = (token: string) => {
  const decodedToken = getDecodedToken(token);
  const expiresInMillis = (decodedToken.exp || 0) * 1000;
  const expirationDate = new Date(expiresInMillis);
  const expirationDateGMT = new Date(expirationDate.toUTCString());
  return expirationDateGMT;
};
