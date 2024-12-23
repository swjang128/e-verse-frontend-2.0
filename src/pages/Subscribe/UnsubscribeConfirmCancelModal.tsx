import React from 'react';
import { t } from 'i18next';
import SubscribeModal from './SubscribeModal';

interface UnsubscribeConfirmCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string;
}

const UnsubscribeConfirmCancelModal: React.FC<
  UnsubscribeConfirmCancelModalProps
> = ({ isOpen, onClose, onConfirm, message, title }) => {
  return (
    <SubscribeModal isOpen={isOpen} onClose={onClose}>
      <div className="border-4 border-red-400">
        <div className="border-b border-stroke px-5 py-4 dark:border-strokedark">
          <h3 className="text-xl font-semibold text-red-500 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="bg-subscribe-custom-gradient px-5 py-4">
          <p className="mb-7.5 text-black dark:text-white">{message}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onConfirm}
              className="cursor-pointer rounded border border-red-300 bg-red-500 px-5 py-1.5 text-white transition hover:bg-opacity-90"
            >
              {t('Button.Unsubscribe')}
            </button>
            <button
              onClick={onClose}
              className="cursor-pointer rounded border border-stroke bg-gray px-5 py-1.5 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
            >
              {t('Button.Cancel')}
            </button>
          </div>
        </div>
      </div>
    </SubscribeModal>
  );
};

export default UnsubscribeConfirmCancelModal;
