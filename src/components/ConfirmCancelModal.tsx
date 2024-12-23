// ConfirmCancelModal.js
import React from 'react';
import Modal from '../Modal';
import { t } from 'i18next';

interface ConfirmCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  title: string;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="border-b border-stroke px-5 py-4 dark:border-strokedark">
        <h3 className="text-xl font-semibold text-black dark:text-white">
          {title}
        </h3>
      </div>
      <div className="px-5 py-4">
        <p className="mb-7.5 text-black dark:text-white">{message}</p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded border bg-primary px-5 py-1.5 text-white transition hover:bg-opacity-90"
          >
            {t('Button.Confirm')}
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer rounded border border-stroke bg-gray px-5 py-1.5 hover:bg-opacity-50 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50"
          >
            {t('Button.Cancel')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmCancelModal;
