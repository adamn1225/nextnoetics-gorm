import React from 'react';
import Image from 'next/image';

interface FormValues {
    title: string;
    content: string;
    status: string;
    template: string;
    scheduled_publish_date?: string;
    featured_image?: string;
    slug: string;
}

interface AdminCmsFormProps {
    formValues: FormValues;
    setFormValues: React.Dispatch<React.SetStateAction<FormValues>>;
    handleSubmit: (e: React.FormEvent) => void;
    handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleContentChange: (content: string) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    editingPost: any;
}

const AdminCmsForm: React.FC<AdminCmsFormProps> = ({
    formValues,
    setFormValues,
    handleSubmit,
    handleTitleChange,
    handleChange,
    handleContentChange,
    handleImageUpload,
    loading,
    editingPost,
}) => {
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-white">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formValues.title}
                    onChange={handleTitleChange}
                    className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <div>
                <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 dark:text-white">
                    Slug
                </label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formValues.slug}
                    onChange={handleChange}
                    className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-semibold mb-1 text-gray-700 dark:text-white">
                    Content
                </label>
                <div className="border border-gray-300 text-zinc-900 rounded-md shadow-sm p-2">
                    <textarea
                        id="content"
                        name="content"
                        value={formValues.content}
                        onChange={(e) => handleContentChange(e.target.value)}
                        className="w-full h-64 p-2 border border-gray-300 rounded-md"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-700 dark:text-white">
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
                <label htmlFor="template" className="block text-sm font-semibold text-gray-700 dark:text-white">
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
                <label htmlFor="scheduled_publish_date" className="block text-sm font-semibold text-gray-700 dark:text-white">
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
                <label htmlFor="featured_image" className="block text-sm font-semibold text-gray-700 dark:text-white">
                    Featured Image
                </label>
                <input
                    type="file"
                    id="featured_image"
                    name="featured_image"
                    onChange={handleImageUpload}
                    className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
                />
                {formValues.featured_image && (
                    <Image src={formValues.featured_image} alt="Featured" className="mt-2 h-32 w-32 object-cover" />
                )}
            </div>
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-700 hover:bg-blue-800"
                disabled={loading}
            >
                {editingPost ? 'Update Post' : 'Add Post'}
            </button>
        </form>
    );
};

export default AdminCmsForm;