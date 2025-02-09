const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
const dayjs = require('dayjs');
const dotenv = require('dotenv');
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("supabaseUrl and supabaseKey are required.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const getUserAccessToken = async (userId, platform) => {
    const { data, error } = await supabase
        .from("user_tokens")
        .select("access_token")
        .eq("user_id", userId)
        .eq("platform", platform)
        .single();

    if (error) {
        console.error("Error fetching token:", error);
        return null;
    }
    return data.access_token;
};

const postToSocialMedia = async (event) => {
    const { sm_platform, title, description, user_id } = event;

    try {
        let url = "";
        let payload = {};

        switch (sm_platform) {
            case "Twitter":
                url = "https://api.twitter.com/2/tweets";
                payload = { text: `${title}\n${description}` };
                break;
            case "Facebook":
                url = `https://graph.facebook.com/v12.0/me/feed`;
                payload = { message: `${title}\n${description}` };
                break;
            case "LinkedIn":
                url = "https://api.linkedin.com/v2/shares";
                payload = { content: `${title}\n${description}` };
                break;
            default:
                return;
        }

        const accessToken = await getUserAccessToken(user_id, sm_platform); // Retrieve stored token
        if (!accessToken) {
            throw new Error(`No access token found for ${sm_platform}`);
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Failed to post on ${sm_platform}`);
        }

        console.log(`Post successfully published on ${sm_platform}`);
    } catch (error) {
        console.error("Error posting:", error);
    }
};

exports.handler = async (event, context) => {
    try {
        const { data: events, error } = await supabase
            .from("smm_calendar")
            .select("*")
            .lte("post_due_date", dayjs().toISOString()) // Events due now or earlier
            .eq("status", "Scheduled")
            .eq("post_automatically", true);

        if (error) {
            throw new Error(error.message);
        }

        for (const event of events) {
            const accessToken = await getUserAccessToken(event.user_id, event.sm_platform);
            if (accessToken) {
                await postToSocialMedia(event);
                await supabase.from("smm_calendar").update({ status: "Published" }).eq("id", event.id);
            } else {
                console.log(`Skipping event ${event.id} due to missing access token`);
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Scheduled posts processed successfully" }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};

module.exports.config = {
    schedule: '@hourly' // Runs every hour
};