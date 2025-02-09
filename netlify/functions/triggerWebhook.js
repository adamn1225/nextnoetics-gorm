import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

export const handler = async (event) => {
    try {
        if (!event.body) {
            console.error("Missing event body");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing request body" }),
            };
        }

        const { status } = JSON.parse(event.body);

        // Validate status and ensure the webhook is configured
        if (!status || typeof status !== "string") {
            console.error("Invalid or missing status field in request.");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid or missing status field." }),
            };
        }

        if (status === "published" && process.env.NEXT_NETLIFY_WEBHOOK) {
            console.log("🚀 Triggering Netlify Build...");

            const response = await fetch(process.env.NEXT_NETLIFY_WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ trigger: "CMS Update" }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to trigger Netlify build. Status: ${response.status}, Response: ${errorText}`);
            }

            console.log(" Netlify Build Triggered Successfully!");
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Netlify build triggered successfully" }),
            };
        }

        console.log("⚠️ No action taken (status not published or missing webhook URL)");
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "No action taken (status not published or missing webhook URL)" }),
        };
    } catch (error) {
        console.error("Error in Netlify Function:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};