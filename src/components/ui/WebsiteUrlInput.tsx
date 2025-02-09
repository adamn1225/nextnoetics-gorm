'use client';
import React, { useState } from 'react';
import { supabase } from '@lib/supabaseClient';

interface WebsiteUrlInputProps {
    userId: string;
    organizationId: string;
    initialUrl: string;
    onUrlChange: (url: string) => void;
}

const WebsiteUrlInput: React.FC<WebsiteUrlInputProps> = ({ userId, organizationId, initialUrl, onUrlChange }) => {
    const [websiteUrl, setWebsiteUrl] = useState(initialUrl);
    const [error, setError] = useState<string | null>(null);

    const handleWebsiteUrlChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!websiteUrl.startsWith('http://') && !websiteUrl.startsWith('https://')) {
            setError('URL must start with http:// or https://');
            return;
        }

        const { error } = await supabase
            .from('organization_members')
            .update({ website_url: websiteUrl })
            .eq('user_id', userId)
            .eq('organization_id', organizationId);

        if (error) {
            console.error('Error updating website URL:', error);
        } else {
            console.log('Website URL updated successfully');
            onUrlChange(websiteUrl);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Update Website URL</label>
            <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="mt-1 block w-full border text-zinc-900 border-gray-300 rounded-md shadow-sm p-2"
            />
            <button
                onClick={handleWebsiteUrlChange}
                className="my-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
                Save Website URL
            </button>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default WebsiteUrlInput;