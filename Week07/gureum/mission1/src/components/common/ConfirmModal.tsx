interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  open,
  title,
  description,
  confirmText = '예',
  cancelText = '아니오',
  loading,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center" onClick={onCancel}>
      <div className="w-full max-w-sm mx-4 bg-gray-900 border border-gray-700 rounded-xl p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-white text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{description}</p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-800">
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
