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
    <div className="flex justify-between items-start mb-6 md:mb-8">
      <div>
        <div className="flex items-center gap-2 md:gap-3">
          {author.avatar ? (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={20} className="text-gray-400" />
            </div>
          )}
          <span className="font-bold text-base md:text-lg">{author.name}</span>
        </div>
        {isEditing ? (
          <Input
            {...register}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mt-3 md:mt-4 bg-transparent border border-gray-500 rounded-md"
          />
        ) : (
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-3 md:mt-4">{title}</h1>
        )}
      </div>
      <div className="text-right">
        <p className="text-xs md:text-sm text-gray-400 whitespace-nowrap">
          {new Date(createdAt).toLocaleDateString()}
        </p>
        {actionButtons && <div className="mt-2 md:mt-3">{actionButtons}</div>}
      </div>
    </div>
  );
};

export default LpHeader;
