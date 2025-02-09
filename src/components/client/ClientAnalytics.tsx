'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import GAnalytics from './GAnalytics';
import GAnalyticsGraph from './GAnalyticsGraph';

interface GA4Data {
    rows: {
        dimensionValues: { value: string }[];
        metricValues: { value: string }[];
    }[];
    error?: string;
}

interface GAnalyticsProps {
    currentRows: any[]; // Specify the type here, e.g., any[], string[], number[], etc.
    handlePageChange: (pageNumber: number) => void; // Specify the type for the function
    currentPage: number;
    indexOfLastRow: number;
    totalRows: number;
}

const ClientAnalytics = () => {
    const [googleAnalyticsPropertyId, setGoogleAnalyticsPropertyId] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState('graph');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('30daysAgo');
    const [endDate, setEndDate] = useState('today');
    const [activeDateRange, setActiveDateRange] = useState('1month'); // New state for active date range
    const rowsPerPage = 10;

    const [ga4Data, setGa4Data] = useState<GA4Data | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('google_analytics_key')
                    .eq('user_id', user.id)
                    .single();

                if (profile) {
                    setGoogleAnalyticsPropertyId(profile.google_analytics_key || '');
                }

                if (error) {
                    console.error('Error fetching profile:', error);
                }
            }
        };

        fetchProfile();
    }, []);

    const fetchGA4Data = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const response = await fetch(`/api/analytics/ga4?userId=${user.id}&startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();
            setGa4Data(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchGA4Data();
    }, [startDate, endDate]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const filteredRows = ga4Data?.rows?.filter(row => 
        row.dimensionValues[0]?.value.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

    const setDateRange = (range: string) => {
        const end = new Date();
        let start = new Date();

        switch (range) {
            case '1week':
                start.setDate(end.getDate() - 7);
                break;
            case '1month':
                start.setMonth(end.getMonth() - 1);
                break;
            case '3months':
                start.setMonth(end.getMonth() - 3);
                break;
            case '6months':
                start.setMonth(end.getMonth() - 6);
                break;
            case '1year':
                start.setFullYear(end.getFullYear() - 1);
                break;
            default:
                start = new Date('30daysAgo');
        }

        setStartDate(start.toISOString().split('T')[0]);
        setEndDate(end.toISOString().split('T')[0]);
        setActiveDateRange(range); // Update active date range
        fetchGA4Data(); // Fetch data after setting the date range
    };

    return (
        <>
            <div className="flex justify-center gap-4 items-start">
                <div className="flex flex-col space-y-4 mb-8">
                    <button
                        onClick={() => setDateRange('1week')}
                        className={`px-4 py-2 rounded ${activeDateRange === '1week' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        1 Week
                    </button>
                    <button
                        onClick={() => setDateRange('1month')}
                        className={`px-4 py-2 rounded ${activeDateRange === '1month' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        1 Month
                    </button>
                    <button
                        onClick={() => setDateRange('3months')}
                        className={`px-4 py-2 rounded ${activeDateRange === '3months' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        3 Months
                    </button>
                    <button
                        onClick={() => setDateRange('6months')}
                        className={`px-4 py-2 rounded ${activeDateRange === '6months' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        6 Months
                    </button>
                    <button
                        onClick={() => setDateRange('1year')}
                        className={`px-4 py-2 rounded ${activeDateRange === '1year' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        1 Year
                    </button>
                </div>
                <div className="p-8 text-gray-950 dark:text-gray-200 flex-1">
                    <h1 className="text-2xl font-bold mb-4 dark:text-white">Analytics Integration</h1>
                    <div className="flex space-x-4 mb-8">
                        <button
                            onClick={() => setActiveTab('table')}
                            className={`px-4 py-2 rounded ${activeTab === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Table View
                        </button>
                        <button
                            onClick={() => setActiveTab('graph')}
                            className={`px-4 py-2 rounded ${activeTab === 'graph' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            Graph View
                        </button>
                    </div>
                    
                    {loading ? (
                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">Loading Google Analytics Data...</h2>
                            <div className="opacity-50">
                                {activeTab === 'table' ? (
                                    <GAnalytics
                                        currentRows={currentRows}
                                        handlePageChange={handlePageChange}
                                        currentPage={currentPage}
                                        indexOfLastRow={indexOfLastRow}
                                        totalRows={filteredRows.length}
                                    />
                                ) : (
                                    <GAnalyticsGraph ga4Data={ga4Data} />
                                )}
                            </div>
                        </div>
                    ) : (
                        ga4Data && !ga4Data.error && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">Google Analytics Data</h2>
                                <input
                                    type="text"
                                    placeholder="Search by Page Path"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="mb-4 px-4 py-2 border border-gray-300 text-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <div className="flex space-x-4 mb-4">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="px-4 py-2 border text-gray-600 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                {ga4Data.rows && ga4Data.rows.length > 0 ? (
                                    activeTab === 'table' ? (
                                        <GAnalytics
                                            currentRows={currentRows}
                                            handlePageChange={handlePageChange}
                                            currentPage={currentPage}
                                            indexOfLastRow={indexOfLastRow}
                                            totalRows={filteredRows.length}
                                        />
                                    ) : (
                                        <GAnalyticsGraph ga4Data={ga4Data} />
                                    )
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-200">No data available for the selected date range.</p>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
};

export default ClientAnalytics;