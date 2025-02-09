import { NextApiRequest, NextApiResponse } from "next";
import { renderToStaticMarkup } from "react-dom/server";
import BlogTemplate from "@components/BlogTemplate";
import { supabase } from "@lib/supabaseClient";
import React from "react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { title, content, template, slug, featured_image } = req.body;

        if (!title || !content || !template || !slug) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Generate static HTML preview
        const previewHtml = renderToStaticMarkup(
            React.createElement(BlogTemplate, { title, content, featured_image })
        );

        // Store preview HTML in Supabase
        const { error } = await supabase
            .from("blog_posts")
            .update({ content_html: previewHtml })
            .eq("slug", slug);

        if (error) {
            return res.status(500).json({ error: "Failed to save preview HTML" });
        }

        return res.status(200).json({ previewHtml });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}