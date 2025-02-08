import React from 'react';

interface FullPageModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    htmlContent?: string; // Add an optional prop for HTML content
}

const FullPageModal: React.FC<FullPageModalProps> = ({ isOpen, onClose, children, htmlContent }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-screen h-full mx-6 overflow-auto bg-white rounded-lg shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                >
                    Close
                </button>
                <div className="p-6">
                    {htmlContent ? (
                        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
};

export default FullPageModal;