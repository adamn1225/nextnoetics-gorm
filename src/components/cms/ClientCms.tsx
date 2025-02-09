'use client';

import { useState, useEffect } from 'react';
import CmsForm from './CmsForm';
import CmsEditor from './CmsEditor';
import PostList from './PostList';
import FullPageModal from './FullPageModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CustomField {
    name: string;
    type: 'text' | 'image' | 'header' | 'color';
    value?: string;
}

interface FormValues {
    id?: number;
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

interface Post extends FormValues {
    id: number;
}

const ClientCms = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [formValues, setFormValues] = useState<FormValues>({
        title: '',
        content: '',
        content_html: '',
        status: 'draft',
        template: 'basic',
        scheduled_publish_date: '',
        featured_image: '',
        slug: '',
        customFields: [],
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/blog_posts`);
            const data = await response.json();
            setPosts(data.blog_posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString(); // ✅ Convert to "YYYY-MM-DDTHH:mm:ssZ"
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const method = editingPost ? "PUT" : "POST";
            const url = editingPost ? `${API_URL}/api/blog_posts/${editingPost.id}` : `${API_URL}/api/blog_posts`;

            // Log the URL for debugging
            console.log("Request URL:", url);

            // ✅ Convert date before sending to backend
            const formattedData = {
                ...formValues,
                scheduled_publish_date: formValues.scheduled_publish_date ? formatDate(formValues.scheduled_publish_date) : undefined,
            };

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });

            const data = await response.json();
            console.log("Server Response:", response.status, data); // Debug response

            if (!response.ok) throw new Error(`Error saving post: ${response.status} - ${data.message || 'No message'}`);

            // ✅ Update posts state
            if (!editingPost) {
                setPosts((prevPosts) => [...prevPosts, data.blog_post]);
            } else {
                setPosts((prevPosts) =>
                    prevPosts.map((post) => (post.id === editingPost.id ? data.blog_post : post))
                );
            }

            setEditingPost(null);
            setFormValues({ title: "", content: "", content_html: "", status: "draft", template: "basic", scheduled_publish_date: "", featured_image: "", slug: "", customFields: [] });

        } catch (error) {
            console.error("Error saving post:", error);
        }

        setLoading(false);
    };




    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const response = await fetch(`${API_URL}/api/blog_posts/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Error deleting post");
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div className="flex justify-center w-full">
            <div className="w-1/4 p-4 bg-gray-100 dark:bg-zinc-900">
                {/* <CmsEditor /> */}
            </div>
            <div className="w-2/3 p-6 bg-white dark:bg-zinc-800 text-gray-950 dark:text-primary rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">CMS Dashboard</h2>
                <CmsForm
                    handleSubmit={handleSubmit}
                    loading={loading}
                    formValues={formValues}
                    SetFormValues={setFormValues}
                    handleTitleChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                    handleChange={(e) => setFormValues({ ...formValues, [e.target.name]: e.target.value })}
                    handleContentChange={(content) => setFormValues({ ...formValues, content })}
                    editingPost={editingPost}
                />
                <PostList posts={posts} handleEdit={setEditingPost} handleDelete={handleDelete} />
            </div>
        </div>
    );
};

export default ClientCms;