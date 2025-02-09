'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Eye, EyeOff } from 'lucide-react';

const ClientSettings = () => {
    const [googleAnalyticsPropertyId, setGoogleAnalyticsPropertyId] = useState('');
    const [semrushKey, setSemrushKey] = useState('');
    const [ahrefsKey, setAhrefsKey] = useState('');
    const [message, setMessage] = useState('');
    const [showGoogleAnalyticsPropertyId, setShowGoogleAnalyticsPropertyId] = useState(false);
    const [showSemrushKey, setShowSemrushKey] = useState(false);
    const [showAhrefsKey, setShowAhrefsKey] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) throw new Error('User not found');

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('google_analytics_key, semrush_key, ahrefs_key')
                    .eq('user_id', user.id)
                    .single();

                if (profileError) throw profileError;

                setProfile(profile);
                setGoogleAnalyticsPropertyId(profile.google_analytics_key || '');
                setSemrushKey(profile.semrush_key || '');
                setAhrefsKey(profile.ahrefs_key || '');
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleGoogleAnalyticsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({ google_analytics_key: googleAnalyticsPropertyId })
                .eq('user_id', user.id);

            if (error) {
                console.error('Error updating Google Analytics property ID:', error);
                setMessage('Failed to integrate Google Analytics.');
            } else {
                setMessage('Google Analytics integrated successfully!');
            }
        }
    };

    const handleSemrushSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({ semrush_key: semrushKey })
                .eq('user_id', user.id);

            if (error) {
                console.error('Error updating SEMrush key:', error);
                setMessage('Failed to integrate SEMrush.');
            } else {
                setMessage('SEMrush integrated successfully!');
            }
        }
    };

    const handleAhrefsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({ ahrefs_key: ahrefsKey })
                .eq('user_id', user.id);

            if (error) {
                console.error('Error updating Ahrefs key:', error);
                setMessage('Failed to integrate Ahrefs.');
            } else {
                setMessage('Ahrefs integrated successfully!');
            }
        }
    };

    return (
        <div className="container mx-auto pt-4 pb-8">
            <h1 className="text-3xl font-semibold mt-8 text-gray-900 dark:text-white">Settings</h1>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {profile && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
                    <div className="mt-4">
                        <label className="block text-lg font-semibold text-gray-800 dark:text-white">Name</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white">{profile.name}</p>
                    </div>
                    <div className="mt-4">
                        <label className="block text-lg font-semibold text-gray-800 dark:text-white">Email</label>
                        <p className="mt-1 text-base text-gray-900 dark:text-white">{profile.email}</p>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold dark:text-gray-100">Google Analytics</h2>
                        <form onSubmit={handleGoogleAnalyticsSubmit}>
                            <label htmlFor="googleAnalyticsPropertyId" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Google Analytics Property ID
                            </label>
                            <div className="relative">
                                <input
                                    type={showGoogleAnalyticsPropertyId ? 'text' : 'password'}
                                    id="googleAnalyticsPropertyId"
                                    value={googleAnalyticsPropertyId}
                                    onChange={(e) => setGoogleAnalyticsPropertyId(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Your GA4 Property ID"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowGoogleAnalyticsPropertyId(!showGoogleAnalyticsPropertyId)}
                                    className="absolute inset-y-0 right-0 md:top-1/3 pr-3 flex items-center text-gray-500"
                                >
                                    {showGoogleAnalyticsPropertyId ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 bg-blue-500 text-nowrap text-sm md:text-normal hover:bg-blue-600 text-white font-bold py-2 px-4 rounded dark:text-gray-50"
                            >
                                Integrate Google Analytics
                            </button>
                        </form>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">SEMrush</h2>
                        <form onSubmit={handleSemrushSubmit}>
                            <label htmlFor="semrushKey" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                                SEMrush API Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showSemrushKey ? 'text' : 'password'}
                                    id="semrushKey"
                                    value={semrushKey}
                                    onChange={(e) => setSemrushKey(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Your SEMrush API Key"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSemrushKey(!showSemrushKey)}
                                    className="absolute inset-y-0 right-0 md:top-1/3 pr-3 flex items-center text-gray-500"
                                >
                                    {showSemrushKey ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 text-sm md:text-normal bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded "
                            >
                                Integrate SEMrush
                            </button>
                        </form>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">Ahrefs</h2>
                        <form onSubmit={handleAhrefsSubmit}>
                            <label htmlFor="ahrefsKey" className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Ahrefs API Key
                            </label>
                            <div className="relative">
                                <input
                                    type={showAhrefsKey ? 'text' : 'password'}
                                    id="ahrefsKey"
                                    value={ahrefsKey}
                                    onChange={(e) => setAhrefsKey(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Your Ahrefs API Key"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowAhrefsKey(!showAhrefsKey)}
                                    className="absolute inset-y-0 right-0 md:top-1/3 pr-3 flex items-center text-gray-500"
                                >
                                    {showAhrefsKey ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="mt-4 text-sm md:text-normal bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                Integrate Ahrefs
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientSettings;