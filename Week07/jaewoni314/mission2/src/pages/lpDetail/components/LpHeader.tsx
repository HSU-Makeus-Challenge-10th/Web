import { User } from 'lucide-react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import Input from '../../../components/input/Input';

interface LpHeaderProps {
  author: {
    avatar: string | null;
    name: string;
  };
  title: string;
  createdAt: string;
  isEditing: boolean;
  register?: UseFormRegisterReturn;
  actionButtons?: React.ReactNode;
}

const LpHeader = ({
  author,
  title,
  createdAt,
  isEditing,
  register,
  actionButtons,
}: LpHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-[3vh]">
      <div>
        <div className="flex items-center gap-[1vw]">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-[3vw] h-[3vw] min-w-10 min-h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-[3vw] h-[3vw] min-w-10 min-h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={20} className="text-gray-400" />
            </div>
          )}
          <span className="font-bold text-[1.1vw]">{author.name}</span>
        </div>
        {isEditing ? (
          <Input
            {...register}
            className="text-[2.5vw] font-bold mt-[1.5vh] bg-transparent border border-gray-500 rounded-md"
          />
        ) : (
          <h1 className="text-[2.5vw] font-bold mt-[1.5vh]">{title}</h1>
        )}
      </div>
      <div className="text-right">
        <p className="text-[0.9vw] text-gray-400 whitespace-nowrap">
          {new Date(createdAt).toLocaleDateString()}
        </p>
        {actionButtons && <div className="mt-[1vh]">{actionButtons}</div>}
      </div>
    </div>
  );
};

export default LpHeader;
