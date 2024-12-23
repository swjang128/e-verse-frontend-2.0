// src/api.ts
import { showToast, ToastType } from './ToastContainer';
import './css/ReactToastify.css';
import { t } from 'i18next';
import { axiosClient } from './AxiosClientProvider';

// GET 요청을 위한 기본 함수
export const fetchData = async (endpoint: string) => {
  try {
    const response = await axiosClient.get(`${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    showToast({
      message: t('Failed to execute request. Please try again.'),
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// POST 요청을 위한 기본 함수
export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.post(`${endpoint}`, data);
    response.data &&
      showToast({
        message: t('Successfully processed!'),
        type: ToastType.SUCCESS,
      });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    showToast({
      message: t('Failed to execute request. Please try again.'),
      type: ToastType.ERROR,
    });
    throw error;
  }
};

export const postAuthCodeData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.post(`${endpoint}`, data);
    response.data &&
      showToast({
        message: t(replaceEmailWithPlaceholder(response.data.data), {
          email: data.email,
        }),
        type: ToastType.INFO,
      });
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    showToast({
      message: t(replaceEmailWithPlaceholder(error.response.data.data), {
        email: data.email,
      }),
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// PATCH 요청을 위한 기본 함수
export const patchData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.patch(`${endpoint}`, data);
    response.data &&
      showToast({
        message: t('Successfully processed!'),
        type: ToastType.SUCCESS,
      });
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    showToast({
      message: t('Failed to execute request. Please try again.'),
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// DELETE 요청을 위한 기본 함수
export const deleteData = async (endpoint: string) => {
  try {
    const response = await axiosClient.delete(`${endpoint}`);
    response.data &&
      showToast({
        message: t('Successfully deleted!'),
        type: ToastType.SUCCESS,
      });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    showToast({
      message: t('Failed to execute request. Please try again.'),
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// 로그인
export const login = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.post(`${endpoint}`, data);
    response &&
      showToast({
        message: t('Successfully logged in!'),
        type: ToastType.SUCCESS,
      });
    return response;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.data ||
      'Failed to execute request. Please try again.';
    showToast({
      message: t(replaceEmailWithPlaceholder(errorMessage), {
        email: data.email,
      }),
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// 로그아웃
export const logout = async (endpoint: string) => {
  try {
    const response = await axiosClient.post(`${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

//엑셀 다운로드
export const fetchExcelData = async (endpoint: string) => {
  try {
    // 이진 데이터를 받기 위해 responseType을 'blob'으로 설정
    const response = await axiosClient.get(`${endpoint}`, {
      withCredentials: true, // 쿠키를 포함하여 요청
      responseType: 'blob', // Blob 형식으로 응답을 받음
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    showToast({
      message: t('Failed to execute request. Please try again.'),
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// email pattern이 발견되었을 시 {{email}} 로 문자열 반환하기
const replaceEmailWithPlaceholder = (message: string) => {
  const replacedMessage = message.replace(
    /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/,
    '{{email}}',
  );
  return replacedMessage;
};

// 시스템 알림 Patch
export const readSystemNotificationData = async (
  endpoint: string,
  data: any,
) => {
  try {
    const response = await axiosClient.patch(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

// 비밀번호 초기화 Patch
export const resetPasswordData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.patch(`${endpoint}`, data);
    response.data &&
      showToast({
        message: t('Your password has been reset. Please check your Email.'),
        type: ToastType.SUCCESS,
      });
    return response.data;
  } catch (error: any) {
    console.error('Error posting data:', error);
    const errorMessage =
      error.response?.data?.data ||
      'Failed to execute request. Please try again.';
    showToast({
      message: t(errorMessage),
      type: ToastType.ERROR,
    });
    throw error;
  }
};

// 챗봇 채팅 전송과 응답
export const postChatData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosClient.post(`${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    showToast({
      message: t('Failed to execute request. Please try again.'),
      type: ToastType.ERROR,
    });
    throw error;
  }
};
