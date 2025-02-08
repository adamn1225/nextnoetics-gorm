const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fetchPosts = async () => {
    const res = await fetch(`${API_URL}/api/blog_posts`);
    return res.json();
};

export const createPost = async (post: any) => {
    const res = await fetch(`${API_URL}/api/blog_posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
    });
    return res.json();
};

export const deletePost = async (id: number) => {
    await fetch(`${API_URL}/api/blog_posts/${id}`, { method: "DELETE" });
};
