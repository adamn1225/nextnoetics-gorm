import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@lib/supabaseClient";
import { fetchTemplateHtml } from "@lib/fetchTemplateHtml";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { userId, template } = req.query;

        if (!userId || Array.isArray(userId)) {
            return res.status(400).json({ error: "Invalid or missing userId parameter" });
        }

        if (!template || Array.isArray(template)) {
            return res.status(400).json({ error: "Invalid or missing template parameter" });
        }

        // Fetch the client's URL from the organization_members table
        const { data: clientData, error: clientError } = await supabase
            .from("organization_members")
            .select("website_url")
            .eq("user_id", userId)
            .single();

        if (clientError || !clientData || !clientData.website_url) {
            console.error("Error fetching client URL:", clientError);
            return res.status(404).json({ error: "Client URL not found" });
        }

        // Ensure the website_url contains https:// or http://
        let websiteUrl = clientData.website_url;
        if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
            websiteUrl = `https://${websiteUrl}`;
        }

        // Construct the template URL
        const templateUrl = `${websiteUrl}/templates/${template}.html`;
        const templateHtml = await fetchTemplateHtml(templateUrl);

        return res.status(200).json({ templateHtml });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
}