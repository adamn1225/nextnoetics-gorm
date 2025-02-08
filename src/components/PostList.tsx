import React, { useState } from 'react';
import FullPageModal from './FullPageModal';
import CmsPreview from './CmsPreview';

interface CustomField {
    name: string;
    type: 'text' | 'image' | 'header' | 'color';
    value?: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    content_html?: string;
    status: 'draft' | 'published';
    template: 'basic' | 'minimal' | 'modern';
    created_at?: string;
    scheduled_publish_date?: string;
    featured_image?: string;
    slug: string; // Make slug required
    customFields?: CustomField[];
}

interface PostListProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (id: number) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, handleEdit, handleDelete }) => {
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);

    const draftPosts = posts.filter(post => post.status === 'draft');
    const publishedPosts = posts.filter(post => post.status === 'published');

    const handlePreview = (post: Post) => {
        setSelectedPost(post);
        setIsPreviewModalOpen(true);
    };

    const confirmDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            handleDelete(id);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-semibold mt-6 dark:text-white">Draft Posts</h3>
            <ul className="mt-4 space-y-4">
                {draftPosts.map((post) => (
                    <li key={post.id} className="p-4 border rounded-md flex justify-between items-center">
                        <span className="font-semibold">{post.title}</span>
                        <div>
                            <button
                                onClick={() => handleEdit(post)}
                                className="mr-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => confirmDelete(post.id)}
                                className="mr-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => handlePreview(post)}
                                className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Preview
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <h3 className="text-xl font-semibold mt-6 dark:text-white">Published Posts</h3>
            <ul className="mt-4 space-y-4">
                {publishedPosts.map((post) => (
                    <li key={post.id} className="p-4 border rounded-md flex justify-between items-center">
                        <span className="font-semibold">{post.title}</span>
                        <div>
                            <button
                                onClick={() => handleEdit(post)}
                                className="mr-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => confirmDelete(post.id)}
                                className="mr-2 inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-red-600 hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => handlePreview(post)}
                                className="inline-flex justify-center py-1 px-3 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                Preview
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {selectedPost && (
                <FullPageModal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)}>
                    <CmsPreview
                        title={selectedPost.title}
                        content={selectedPost.content}
                        content_html={selectedPost.content_html}
                        template={selectedPost.template}
                        featured_image={selectedPost.featured_image}
                    />
                </FullPageModal>
            )}
        </div>
    );
};

export default PostList;