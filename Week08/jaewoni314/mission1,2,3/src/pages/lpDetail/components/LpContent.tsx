import type { UseFormRegisterReturn } from 'react-hook-form';

interface LpContentProps {
  content: string;
  isEditing: boolean;
  register?: UseFormRegisterReturn;
}

const LpContent = ({ content, isEditing, register }: LpContentProps) => {
  return (
    <div className="mb-4 md:mb-6">
      {isEditing ? (
        <textarea
          {...register}
          rows={5}
          className="w-full text-center bg-transparent border border-gray-500 rounded-md resize-none p-2 leading-relaxed text-sm md:text-base"
        />
      ) : (
        <p className="text-center leading-relaxed text-sm md:text-base">{content}</p>
      )}
    </div>
  );
};

export default LpContent;
