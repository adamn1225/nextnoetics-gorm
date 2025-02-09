'use client';
import React, { useState } from "react";

interface CustomInputProps {
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    required?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ id, label, type, value, onChange, required = false }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative my-5 w-full">
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(value !== "")}
                required={required}
                className="bg-transparent border-0 border-b-2 border-gray-800 w-full py-2 text-lg text-gray-900 focus:outline-none focus:border-lightblue"
            />
            <label htmlFor={id} className="absolute top-2 left-0 pointer-events-none">
                {label.split("").map((char, index) => (
                    <span
                        key={index}
                        className={`inline-block text-lg text-gray-900 transition-transform duration-300 ease-in-out ${isFocused || value ? "transform -translate-y-8 text-lightblue" : ""}`}
                        style={{ transitionDelay: `${index * 50}ms` }}
                    >
                        {char}
                    </span>
                ))}
            </label>
        </div>
    );
};

export default CustomInput;