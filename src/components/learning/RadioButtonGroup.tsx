'use client';
import { memo } from "react";

interface RadioButtonGroupProps {
    options: { value: number; label: string; }[];
    selectedValue: number;
    onChange: (value: number) => void;
    name: string;
}

const RadioButtonGroup = memo(({ options, selectedValue, onChange, name }: RadioButtonGroupProps) => (
    <div className="mt-2 flex flex-wrap justify-center gap-3">
        {options.map(({ value, label }) => (
            <label key={value} className="relative">
                <input type="radio" name={name} value={value} checked={selectedValue === value}
                    onChange={() => onChange(value)} className="hidden"
                />

                <span className={`px-4 py-2 rounded-lg border-2 transition cursor-pointer block text-center
                      ${selectedValue === value ? "bg-blue-500 text-white border-blue-600 shadow-md" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}`}
                > {label}
                </span>
            </label>
        ))}
    </div>
));

RadioButtonGroup.displayName = "RadioButtonGroup";

export default RadioButtonGroup;