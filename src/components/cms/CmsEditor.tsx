'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface CustomField {
    name: string;
    type: 'text' | 'image' | 'header' | 'color';
    value?: string;
    alt?: string;
}

interface CmsEditorProps {
    customFields: CustomField[];
    setCustomFields: React.Dispatch<React.SetStateAction<CustomField[]>>;
}

const CmsEditor: React.FC<CmsEditorProps> = ({ customFields, setCustomFields }) => {
    const handleAddField = (type: CustomField['type']) => {
        setCustomFields([...customFields, { name: '', type, value: '', alt: '' }]);
    };

    const handleRemoveField = (index: number) => {
        setCustomFields(customFields.filter((_, i) => i !== index));
    };

    const handleFieldChange = (index: number, field: string, value: string) => {
        const updatedFields = customFields.map((customField, i) =>
            i === index ? { ...customField, [field]: value } : customField
        );
        setCustomFields(updatedFields);
    };


    const [formValues, updateFormValues] = React.useState<{ featured_image?: string }>({});

    function setFormValues(updateFn: (prev: { featured_image?: string }) => { featured_image?: string }) {
        updateFormValues((prev) => updateFn(prev));
    }



    function handleImageUpload(index: number, e: React.ChangeEvent<HTMLInputElement>): void {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleFieldChange(index, 'value', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }
    return (
        <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-950 dark:text-primary">Add Custom Fields</h3>
            <div className="mb-4">
                <button
                    type="button"
                    onClick={() => handleAddField('header')}
                    className="block w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg"
                >
                    Add Header/Text Field
                </button>
                <button
                    type="button"
                    onClick={() => handleAddField('image')}
                    className="block w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg"
                >
                    Add Image Field
                </button>
                <button
                    type="button"
                    onClick={() => handleAddField('color')}
                    className="block w-full mb-2 py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg"
                >
                    Add Color Field
                </button>
            </div>
            {customFields.map((field, index) => (
                <div key={index} className="mb-4">
                    <input
                        type="text"
                        placeholder="Custom Field Name (optional)"
                        value={field.name}
                        onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                        className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {field.type === 'header' && (
                        <>
                            <input
                                type="text"
                                placeholder="Header Field"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <textarea
                                placeholder="Text Field"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </>
                    )}
                    {field.type === 'image' && (
                        <>
                            <input
                                type="file"
                                onChange={(e) => handleImageUpload(index, e)}
                                className="block w-full mb-2 border text-zinc-900 dark:text-primary border-gray-300 rounded-md shadow-sm p-2"
                            />
                            {field.value && (
                                <Image width={300} height={300} src={field.value} alt={field.alt || ''} className="mt-2 h-32 w-32 object-cover" />
                            )}
                            <input
                                type="text"
                                placeholder="Alt Text"
                                value={field.alt}
                                onChange={(e) => handleFieldChange(index, 'alt', e.target.value)}
                                className="block w-full mb-2 border text-zinc-900 dark:text-primary border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </>
                    )}
                    {field.type !== 'header' && field.type !== 'image' && (
                        <input
                            type="text"
                            placeholder={`${field.type.charAt(0).toUpperCase() + field.type.slice(1)} Field`}
                            value={field.value}
                            onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                            className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                        />
                    )}
                    <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                        Remove Field
                    </button>
                </div>
            ))}
        </div>
    );
};

export default CmsEditor;