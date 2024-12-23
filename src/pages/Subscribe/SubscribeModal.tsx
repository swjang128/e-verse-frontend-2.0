import React from 'react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center rounded bg-black bg-opacity-30 p-4">
      <div className="relative w-full rounded bg-white shadow-lg dark:bg-boxdark-2 xl:w-1/3">
        <button
          className="absolute right-5 top-4 text-black dark:text-white"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default SubscribeModal;
