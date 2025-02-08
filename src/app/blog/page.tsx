"use client";
import { useEffect, useState } from "react";
import { fetchPosts, createPost, deletePost } from "@/lib/api";
import ClientCms from "@/components/ClientCms";

export default function Blog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        fetchPosts().then((data) => setPosts(data.blog_posts));
    }, []);

    const handleCreate = async () => {
        await createPost({ title, content: "New Post Content", status: "draft" });
        setTitle("");
        fetchPosts().then((data) => setPosts(data.blog_posts));
    };

    const handleDelete = async (id: number) => {
        await deletePost(id);
        fetchPosts().then((data) => setPosts(data.blog_posts));
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-center">Blog Posts</h1>
            <div className="flex flex-col gap-12 justify-stretch items-stretch">
                <div>
                    <ClientCms />
                </div>
                <div className="mt-4">
                    <input className="border p-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter post title" />
                    <button onClick={handleCreate} className="ml-2 p-2 bg-blue-500 text-white">Create Post</button>
                </div>
                <ul className="mt-4">
                    {posts.map((post) => (
                        <li key={post.id} className="border p-2 flex justify-between">
                            <span>{post.title}</span>
                            <button onClick={() => handleDelete(post.id)} className="bg-red-500 text-white p-1">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}
