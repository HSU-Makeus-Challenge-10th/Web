import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import Button from '../button/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;

  content?: string;
  children?: ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  onConfirm,

  content,
  children,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex justify-center items-center">
        <div
          className="flex flex-col bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white ml-auto"
          >
            <X size={24} />
          </button>

          {content ? (
            <>
              <div className="text-white mb-6">{content}</div>
              <div className="flex justify-end gap-4">
                <Button variant="secondary" onClick={onClose}>
                  아니오
                </Button>
                <Button variant="primary" onClick={onConfirm}>
                  예
                </Button>
              </div>
            </>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
