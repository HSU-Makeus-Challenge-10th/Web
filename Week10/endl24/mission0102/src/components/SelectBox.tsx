import { memo } from "react";

interface SelectBoxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    id?: string;
    className?: string;
}

export const SelectBox = memo(({
    checked,
    onChange,
    label,
    id = "checkbox",
    className = "",
}: SelectBoxProps) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="size-5 cursor-pointer rounded-md border-2 border-zinc-300 bg-white text-violet-600 transition-all duration-300 hover:border-violet-400 focus:ring-4 focus:ring-violet-500/20 focus:ring-offset-0"
            />
            <label htmlFor={id} className="cursor-pointer select-none text-sm font-bold text-zinc-800">
                {label}
            </label>
        </div>
    );
});