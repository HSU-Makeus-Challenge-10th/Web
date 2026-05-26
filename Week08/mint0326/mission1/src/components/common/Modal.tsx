import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    zIndex?: string;
}

/**
 * 공통 모달 껍데기 컴포넌트
 * - 배경 블러 오버레이
 * - 모달 컨테이너 (rounded, shadow 등)
 * - X 닫기 버튼
 * - 바깥 영역 클릭 시 닫힘
 */
const Modal = ({ isOpen, onClose, title, children, zIndex = 'z-50' }: ModalProps) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className={`fixed inset-0 ${zIndex} flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer`}
            onClick={handleBackdropClick}
        >
            <div
                className="bg-[#222222] rounded-xl p-6 w-[400px] max-h-[90vh] overflow-y-auto relative cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="모달 닫기"
                >
                    <X size={24} />
                </button>

                {title && (
                    <h2 className="text-xl font-bold mb-4">{title}</h2>
                )}

                {children}
            </div>
        </div>
    );
};

export default Modal;
