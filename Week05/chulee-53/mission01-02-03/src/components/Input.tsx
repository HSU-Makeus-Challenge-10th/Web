import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: string[]) => twMerge(clsx(inputs));

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    errorMessage?: string;
}

const Input = ({ errorMessage, className, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-2">
            <input
                className={cn("bg-transparent text-white text-sm px-4 py-3 rounded-md outline-none border transition-colors",
                    errorMessage ? 'border-red-500 focus:border-blue-500' : 'border-gray-500 hover:border-gray-400 focus:border-blue-500',
                    className || ''
                )}
                {...props}
            />
            {errorMessage && <p className="text-red-500 text-xs">{errorMessage}</p>}
        </div>
    );
};

export default Input;
