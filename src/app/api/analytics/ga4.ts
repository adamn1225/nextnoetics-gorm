import { NextApiRequest, NextApiResponse } from 'next';
import { google, Auth } from 'googleapis';
import { supabase } from '@lib/supabaseClient';
import path from 'path';
import fs from 'fs';

const analytics = google.analyticsdata('v1beta');

// Load OAuth2 credentials from a JSON file
const keyFilePath = path.join(process.cwd(), 'credentials/service-account-key.json');
const keyFile = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

const auth = new google.auth.GoogleAuth({
    keyFile: keyFilePath,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});

async function getGA4Data(userId: string, startDate: string, endDate: string) {
    // Fetch the user's Google Analytics property ID from the database
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('google_analytics_key')
        .eq('user_id', userId)
        .single();

    if (profileError || !profile || !profile.google_analytics_key) {
        console.error('Failed to fetch Google Analytics property ID:', profileError);
        throw new Error('Failed to fetch Google Analytics property ID');
    }

    const googleAnalyticsPropertyId = profile.google_analytics_key;
    console.log('Fetched Google Analytics property ID:', googleAnalyticsPropertyId);

    // Use OAuth2 to authenticate and fetch data
    const client = await auth.getClient() as Auth.OAuth2Client;
    google.options({
        auth: client,
    });

    const response = await analytics.properties.runReport({
        property: `properties/${googleAnalyticsPropertyId}`, // Use the user's property ID to specify the property
        requestBody: {
            dimensions: [
                { name: 'pagePath' },
                { name: 'sessionSourceMedium' },
                { name: 'country' },
                { name: 'deviceCategory' }
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'eventCount' },
                { name: 'engagementRate' },
                { name: 'conversions' }
            ],
            dateRanges: [{ startDate, endDate }],
        },
    });

    console.log('GA4 API Response:', response.data); // Log the full API response

    return response.data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const userId = req.query.userId as string;
        const startDate = req.query.startDate as string;
        const endDate = req.query.endDate as string;

        try {
            const data = await getGA4Data(userId, startDate, endDate);
            res.status(200).json(data);
        } catch (error: any) {
            console.error('Error fetching GA4 data:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}