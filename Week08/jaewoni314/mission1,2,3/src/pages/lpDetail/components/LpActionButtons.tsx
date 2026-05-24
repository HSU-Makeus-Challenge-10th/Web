import { Pencil, Trash2 } from 'lucide-react';
import Button from '../../../components/button/Button';

interface LpActionButtonsProps {
  isAuthor: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
}

const LpActionButtons = ({
  isAuthor,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  isSaving,
}: LpActionButtonsProps) => {
  if (!isAuthor) return null;

  return (
    <div className="flex gap-2 md:gap-4 text-gray-400">
      {isEditing ? (
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSaving}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            onClick={onSave}
            disabled={isSaving}
          >
            {isSaving ? '저장중...' : '저장'}
          </Button>
        </>
      ) : (
        <>
          <button type="button" className="hover:text-white" onClick={onEdit}>
            <Pencil size={20} />
          </button>
          <button type="button" className="hover:text-white" onClick={onDelete}>
            <Trash2 size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default LpActionButtons;
