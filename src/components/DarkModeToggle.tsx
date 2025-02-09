'use client';
import React from "react";
import { useDarkMode } from "@context/DarkModeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle: React.FC = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    return (
        <div
            onClick={toggleDarkMode}
            className={`relative inline-flex items-center h-8 w-20 rounded-full cursor-pointer transition-colors duration-300 ${isDarkMode ? "bg-gray-700" : "bg-gray-400"
                }`}
        >
            <span className="sr-only">Toggle Dark Mode</span>
            <span
                className={`absolute left-1 top-1 inline-flex justify-center w-10 h-6 transform bg-white rounded-full transition-transform duration-300 ${isDarkMode ? "translate-x-8" : "translate-x-0"
                    }`}
            >
                {isDarkMode ? (
                    <FaSun className="text-yellow-500 w-4 h-4 m-1" />
                ) : (
                    <FaMoon className="text-gray-800 w-4 h-4 m-1" />
                )}
            </span>
        </div>
    );
};

export default DarkModeToggle;