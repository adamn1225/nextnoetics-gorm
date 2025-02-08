import React from 'react';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CustomField {
    name: string;
    type: 'text' | 'image' | 'header' | 'color';
    value?: string;
}

interface FormValues {
    title: string;
    content: string;
    content_html?: string;
    status: 'draft' | 'published';
    template: 'basic' | 'minimal' | 'modern';
    scheduled_publish_date?: string;
    featured_image?: string;
    slug: string;
    customFields?: CustomField[];
}

interface CmsFormProps {
    formValues: FormValues;
    SetFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
    handleSubmit: (e: React.FormEvent) => void;
    handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleContentChange: (content: string) => void;
    loading: boolean;
    editingPost: any;

}

const CmsForm: React.FC<CmsFormProps> = ({
    formValues,
    SetFormValues,
    handleSubmit,
    handleTitleChange,
    handleChange,
    handleContentChange,
    loading,
    editingPost,
}) => {
    const handleFieldChange = (index: number, field: string, value: string) => {
        SetFormValues((prevValues) => ({
            ...prevValues,
            customFields: prevValues.customFields?.map((customField, i) =>
                i === index ? { ...customField, [field]: value } : customField
            ) || [],
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`${API_URL}/api/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            SetFormValues((prev) => ({ ...prev, featured_image: data.url }));
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };


    const handleRemoveField = (index: number) => {
        SetFormValues((prevValues) => ({
            ...prevValues,
            customFields: prevValues.customFields?.filter((_, i) => i !== index) || [],
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm md:text-base font-semibold text-gray-950 dark:text-primary">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder='H1 Post Title'
                    value={formValues.title}
                    onChange={handleTitleChange}
                    className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div>
                <label htmlFor="slug" className="block text-sm md:text-base font-semibold text-gray-950 dark:text-primary">
                    Slug
                </label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    placeholder='Post Slug (parameters - editing is optional)'
                    value={formValues.slug}
                    onChange={handleChange}
                    className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm md:text-base font-semibold mb-1 text-gray-950 dark:text-primary">
                    Content (Body)
                </label>
                <div className="border border-gray-300 text-zinc-900 rounded-md shadow-sm p-2">
                    <textarea
                        value={formValues.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className="block w-full h-48 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
            </div>
            <div className='w-1/2 flex flex-col gap-2 text-base'>
                <div>
                    <label htmlFor="status" className="block text-base font-semibold text-gray-950 dark:text-primary">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formValues.status}
                        onChange={handleChange}
                        className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                        required
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="template" className="block text-base font-semibold text-gray-950 dark:text-primary">
                        Template
                    </label>
                    <select
                        id="template"
                        name="template"
                        value={formValues.template}
                        onChange={handleChange}
                        className="mt-1 block w-full text-zinc-900 border border-gray-300 rounded-md shadow-sm p-2"
                        required
                    >
                        <option value="basic">Basic</option>
                        <option value="minimal">Minimal</option>
                        <option value="modern">Modern</option>
                        <option value="none">No template available</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="scheduled_publish_date" className="block text-base font-semibold text-gray-950 dark:text-primary">
                        Scheduled Publish Date
                    </label>
                    <input
                        type="datetime-local"
                        id="scheduled_publish_date"
                        name="scheduled_publish_date"
                        value={formValues.scheduled_publish_date}
                        onChange={handleChange}
                        className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label htmlFor="featured_image" className="block text-base font-semibold text-gray-950 dark:text-primary">
                        Featured Image
                    </label>
                    <input
                        type="file"
                        id="featured_image"
                        name="featured_image"
                        onChange={handleImageUpload}
                        className="mt-1 block w-full border text-gray-300 border-gray-300 rounded-md shadow-sm p-2"
                    />
                    {formValues.featured_image && (
                        <Image
                            src={formValues.featured_image}
                            alt="Featured"
                            width={128}
                            height={128}
                            className="mt-2 h-32 w-32 object-cover"
                        />
                    )}
                </div>
            </div>
            <div>
                {/* <h3 className="text-lg font-semibold mb-4 underline">Custom Fields</h3> */}
                {formValues.customFields?.map((field, index) => (
                    <div key={index} className="mb-4">
                        <input
                            type="text"
                            placeholder="Field Name"
                            value={field.name}
                            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                            className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                        />
                        {field.type === 'header' && (
                            <input
                                type="text"
                                placeholder="Header Field"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                        )}
                        {field.type === 'text' && (
                            <textarea
                                placeholder="Text Field"
                                value={field.value}
                                onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                className="block w-full mb-2 border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                            />
                        )}
                        {field.type !== 'header' && field.type !== 'text' && (
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
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-base font-semibold rounded-md text-white bg-red-600 hover:bg-red-700"
                        >
                            Remove Field
                        </button>
                    </div>
                ))}
            </div>
            <button
                type="submit"
                className="mt-2 py-2 px-4 w-1/4 border border-transparent shadow-sm text-base font-semibold rounded-md text-white btn-gradient hover:opacity-90 hover:shadow-lg"
                disabled={loading}
            >
                {editingPost ? 'Update Post' : 'Add Post'}
            </button>
        </form>
    );
};

export default CmsForm;