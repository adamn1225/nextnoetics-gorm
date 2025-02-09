'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import OnboardingForm from '@components/OnboardingForm';
import OnboardingFormReview from '@components/OnboardingFormReview';
import Spinner from '@components/ui/Spinner';

const ClientDashboard = () => {
    const [userName, setUserName] = useState<string | null>(null);
    const [tasksInProgress, setTasksInProgress] = useState(0);
    const [tasksPending, setTasksPending] = useState(0);
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [filesUploaded, setFilesUploaded] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(false);
    const [formData, setFormData] = useState<any>({
        business_name: '',
        business_description: '',
        target_audience: '',
        project_goals: '',
        design_style: '',
        branding_materials: '',
        inspiration: '',
        color_preferences: '',
        features: '',
        user_authentication: '',
        content_management: '',
        ecommerce_needs: '',
        integrations: '',
        content_ready: '',
        page_count: '',
        seo_assistance: '',
        domain_info: '',
        hosting_info: '',
        maintenance_needs: '',
        budget_range: '',
        timeline: '',
        analytics: '',
        training: '',
        additional_services: '',
        other_info: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get the current user
                const { data: authData, error: authError } = await supabase.auth.getUser();
                if (authError) {
                    throw authError;
                }

                const userId = authData?.user?.id;
                if (!userId) {
                    throw new Error('User ID not found');
                }

                // Fetch user profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('name, onboarding_completed')
                    .eq('user_id', userId)
                    .single();

                if (profileError) {
                    throw profileError;
                }

                setUserName(profileData?.name || 'User');
                setIsOnboardingCompleted(profileData?.onboarding_completed || false);

                // Fetch tasks in progress
                const { count: tasksInProgressCount, error: tasksInProgressError } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact' })
                    .eq('user_id', userId)
                    .eq('status', 'In Progress');

                if (tasksInProgressError) {
                    throw tasksInProgressError;
                }

                setTasksInProgress(tasksInProgressCount || 0);

                // Fetch tasks pending
                const { count: tasksPendingCount, error: tasksPendingError } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact' })
                    .eq('user_id', userId)
                    .eq('status', 'Pending');

                if (tasksPendingError) {
                    throw tasksPendingError;
                }

                setTasksPending(tasksPendingCount || 0);

                // Fetch tasks completed
                const { count: tasksCompletedCount, error: tasksCompletedError } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact' })
                    .eq('user_id', userId)
                    .eq('status', 'Completed');

                if (tasksCompletedError) {
                    throw tasksCompletedError;
                }

                setTasksCompleted(tasksCompletedCount || 0);

                // Fetch files uploaded
                const { count: filesCount, error: filesError } = await supabase
                    .from('files')
                    .select('*', { count: 'exact' })
                    .eq('user_id', userId);

                if (filesError) {
                    throw filesError;
                }

                setFilesUploaded(filesCount || 0);

                // Fetch onboarding form data
                const { data: formData, error: formError } = await supabase
                    .from('client_project_plan')
                    .select('*')
                    .eq('user_id', userId)
                    .single();

                if (formError && formError.code !== 'PGRST116') {
                    throw formError;
                }

                if (formData) {
                    setFormData(formData);
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleOnboardingComplete = async (submittedFormData: any) => {
        try {
            const { data: authData, error: authError } = await supabase.auth.getUser();
            if (authError) {
                throw authError;
            }

            const userId = authData?.user?.id;
            if (!userId) {
                throw new Error('User ID not found');
            }

            // Update profile with onboarding_completed
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ onboarding_completed: true })
                .eq('user_id', userId);

            if (profileError) {
                throw profileError;
            }

            // Update organization_members with organization_name
            const { data: profileData, error: profileFetchError } = await supabase
                .from('profiles')
                .select('organization_id')
                .eq('user_id', userId)
                .single();

            if (profileFetchError) {
                throw profileFetchError;
            }

            const organizationId = profileData.organization_id;

            if (!organizationId) {
                throw new Error('Organization ID not found');
            }

            const { data: orgData, error: orgError } = await supabase
                .from('organizations')
                .select('name')
                .eq('id', organizationId)
                .single();

            if (orgError) {
                throw orgError;
            }

            const organizationName = orgData.name;

            const { error: memberError } = await supabase
                .from('organization_members')
                .update({ organization_name: organizationName })
                .eq('organization_id', organizationId)
                .eq('user_id', userId);

            if (memberError) {
                throw memberError;
            }

            setIsOnboardingCompleted(true);
            setFormData(submittedFormData); // Set the submitted form data
        } catch (error: any) {
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <>
            <div className="p-2">
                {!isOnboardingCompleted ? (
                    <OnboardingForm onComplete={handleOnboardingComplete} />
                ) : (
                    <>
                        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Welcome {userName} to Your Dashboard</h1>
                        <p className="text-gray-700 dark:text-white">
                            Here you can manage your tasks, upload files, and track the progress of your projects.
                        </p>

                        {/* Summary Boxes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h2 className="text-lg font-bold">Tasks</h2>
                                <p className="text-sm text-gray-600">
                                    <span className="inline-block w-4 h-4 rounded-full bg-orange-400 mr-2"></span>
                                    {tasksInProgress} tasks in progress
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="inline-block w-4 h-4 rounded-full bg-yellow-500 mr-2"></span>
                                    {tasksPending} tasks pending
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="inline-block w-4 h-4 rounded-full bg-foreground mr-2"></span>
                                    {tasksCompleted} tasks completed
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow">
                                <h2 className="text-lg font-bold">Files</h2>
                                <p className="text-sm text-gray-600">{filesUploaded} files uploaded</p>
                            </div>
                        </div>

                        <OnboardingFormReview formData={formData} onEdit={() => { }} />
                    </>
                )}
            </div>
        </>
    );
};

export default ClientDashboard;