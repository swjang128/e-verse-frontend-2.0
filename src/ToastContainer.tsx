import { toast } from 'react-toastify';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

interface ToastProps {
  message: string;
  type: ToastType;
}

// Toast를 컴포넌트가 아닌 함수로 만듭니다.
export const showToast = ({ message, type }: ToastProps) => {
  switch (type) {
    case ToastType.SUCCESS:
      toast.success(message, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true, // Progress bar 숨김
        closeOnClick: true,
      });
      break;
    case ToastType.ERROR:
      toast.error(message, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      break;
    case ToastType.WARNING:
      toast.warning(message, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      break;
    case ToastType.INFO:
      toast.info(message, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
      });
      break;
    default:
      break;
  }
};
