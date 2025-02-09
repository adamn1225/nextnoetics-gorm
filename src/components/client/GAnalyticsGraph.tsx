import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface GA4Data {
    rows: {
        dimensionValues: { value: string }[];
        metricValues: { value: string }[];
    }[];
    error?: string;
}

interface GAnalyticsGraphProps {
    ga4Data: GA4Data | null;
}

const GAnalyticsGraph = ({ ga4Data }: GAnalyticsGraphProps) => {
    const data = ga4Data?.rows?.map(row => ({
        pagePath: row.dimensionValues[0]?.value || 'N/A',
        activeUsers: parseInt(row.metricValues[0]?.value || '0', 10),
        sessions: parseInt(row.metricValues[1]?.value || '0', 10),
        bounceRate: parseFloat(row.metricValues[2]?.value || '0'),
        avgSessionDuration: parseFloat(row.metricValues[3]?.value || '0'),
    })) || [];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="pagePath" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" />
                <Line type="monotone" dataKey="sessions" stroke="#82ca9d" />
                <Line type="monotone" dataKey="bounceRate" stroke="#ffc658" />
                <Line type="monotone" dataKey="avgSessionDuration" stroke="#ff7300" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default GAnalyticsGraph;