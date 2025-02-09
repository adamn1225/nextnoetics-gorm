'use client';

import React, { useState } from 'react';
import { supabase } from '@lib/supabaseClient';

const PublicOnboardingForm: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        phone_number: '',
        full_name: '',
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
        other_info: '',
        create_account: false,
        current_website: false,
        website_name: '',
        service_type: '', // Add service_type to formData
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage('');

        try {
            const { data, error: formError } = await supabase.from('public_project_plan').insert([
                formData
            ]).select();

            if (formError) {
                throw formError;
            }

            const newRecord = data[0];
            setSuccessMessage('Your project plan has been successfully submitted!');

            if (formData.create_account) {
                // Handle account creation logic here
                const { error: inviteError } = await supabase.auth.signInWithOtp({
                    email: formData.email,
                    options: {
                        emailRedirectTo: 'https://www.noetics.io/setup-password', // Redirect URL to the password setup page
                    },
                });

                if (inviteError) {
                    throw inviteError;
                }

                // Update the profile to set onboarding_completed to true
                const { data: authData, error: authError } = await supabase.auth.getUser();
                if (authError || !authData.user) {
                    throw new Error('User not authenticated');
                }

                const userId = authData.user.id;

                // Insert user into profiles table
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([{ user_id: userId, email: formData.email, name: formData.full_name }]);

                if (profileError) {
                    throw profileError;
                }

                // Create organization if not provided
                const orgName = formData.business_name || `${formData.email.split('@')[0]}'s Organization`;
                const { data: orgData, error: orgError } = await supabase
                    .from('organizations')
                    .insert([{ name: orgName }])
                    .select()
                    .single();

                if (orgError) {
                    throw orgError;
                }

                const organizationId = orgData.id;

                // Update profile with organization_id
                const { error: profileUpdateError } = await supabase
                    .from('profiles')
                    .update({ organization_id: organizationId, onboarding_completed: true })
                    .eq('user_id', userId);

                if (profileUpdateError) {
                    throw profileUpdateError;
                }

                // Insert into organization_members table
                const { error: memberError } = await supabase
                    .from('organization_members')
                    .insert([{ organization_id: organizationId, user_id: userId, role: 'client', organization_name: orgName }]);

                if (memberError) {
                    throw memberError;
                }

                // Move data from public_project_plan to client_project_plan
                const { error: moveError } = await supabase
                    .from('client_project_plan')
                    .insert([{ ...formData, user_id: userId }]);

                if (moveError) {
                    throw moveError;
                }

                // Delete the entry from public_project_plan
                const { error: deleteError } = await supabase
                    .from('public_project_plan')
                    .delete()
                    .eq('id', newRecord.id);

                if (deleteError) {
                    throw deleteError;
                }

                alert('Account creation link sent to your email.');
            }
        } catch (error: any) {
            console.error('Error submitting form:', error.message);
            alert('There was an error submitting the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-[90vw] md:w-[70vw] h-fit mx-auto p-4 md:p-8 bg-white mt-12 mb-12 dark:bg-gray-700 rounded shadow">
            {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-2 w-full mt-12 mb-4">
                <h1 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">Your Project Plan</h1>
                <h3 className="text-lg font-bold mt-6 text-gray-700 dark:text-white">
                    Complete this form to submit your project plan
                </h3>
                <div className='flex flex-col gap-1 pt-8'>
                    <span className='font-extrabold text-xl underline underline-offset-4 text-gray-800 dark:text-white'>Important: </span>
                    <h2 className='text-base font-semibold mb-2 text-gray-900 dark:text-white italic underline underline-offset-2'>
                        Make sure to fill out all fields to the best of your ability. The more information we have, the better your dream outcome will be!
                    </h2>
                </div>
                <div>
                    <label htmlFor="service_type" className="block font-semibold text-gray-900 dark:text-white">Service Type</label>
                    <select
                        id="service_type"
                        name="service_type"
                        value={formData.service_type}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                    >
                        <option value="" disabled>Select a service</option>
                        <option value="web_app">Custom Web App or Web Site Development</option>
                        <option value="web_scraping">Web Scraping</option>
                        <option value="chrome_extensions">Chrome Extensions</option>
                        <option value="custom_tools">Custom Tools (Automations, calculators, directories, ticket support systems, etc)</option>
                        <option value="smm">Social Media Marketing</option>
                        <option value="seo_ppc">SEO/PPC Advertising</option>
                    </select>
                </div>
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Do you have a website?</label>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="current_website_yes"
                            name="current_website"
                            value="true"
                            checked={formData.current_website === true}
                            onChange={() => setFormData((prev) => ({ ...prev, current_website: true }))}
                            className="mr-2"
                        />
                        <label htmlFor="current_website_yes" className="mr-4 text-gray-900 dark:text-white">Yes</label>
                        <input
                            type="radio"
                            id="current_website_no"
                            name="current_website"
                            value="false"
                            checked={formData.current_website === false}
                            onChange={() => setFormData((prev) => ({ ...prev, current_website: false, website_name: '' }))}
                            className="mr-2"
                        />
                        <label htmlFor="current_website_no" className="text-gray-900 dark:text-white">No</label>
                    </div>
                </div>

                {formData.current_website && (
                    <div>
                        <label htmlFor="website_name" className="block font-semibold text-gray-900 dark:text-white">Website Domain Name</label>
                        <input
                            type="text"
                            id="website_name"
                            name="website_name"
                            placeholder='e.g., www.example.com'
                            value={formData.website_name}
                            onChange={handleChange}
                            className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        />
                    </div>
                )}
                <div className='mt-4'>
                    <label htmlFor="business_name" className="block font-semibold mt-4 text-gray-900 dark:text-white">Business Name</label>
                    <input
                        type="text"
                        id="business_name"
                        name="business_name"
                        placeholder='Acme Inc.'
                        value={formData.business_name}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="business_description" className="block font-semibold text-gray-900 dark:text-white">Describe Your Business/Project</label>
                    <textarea
                        id="business_description"
                        name="business_description"
                        placeholder='Give us the best description of your business or project; the more we know, the better.'
                        value={formData.business_description}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        rows={3}
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="target_audience" className="block font-semibold text-gray-900 dark:text-white">Target Audience</label>
                    <input
                        id="target_audience"
                        name="target_audience"
                        placeholder="Who&apos;s attention are you trying to capture?"
                        value={formData.target_audience}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                    ></input>
                </div>

                <div>
                    <label htmlFor="project_goals" className="block font-semibold text-gray-900 dark:text-white">Project Goals</label>
                    <textarea
                        id="project_goals"
                        name="project_goals"
                        placeholder='Tell us your dreams... specifically related to this project.'
                        value={formData.project_goals}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        rows={2}
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="design_style" className="block font-semibold text-gray-900 dark:text-white">Preferred Design Style</label>
                    <textarea
                        id="design_style"
                        name="design_style"
                        placeholder='Modern, minimal, eccentric etc. - be as specific as you&apos;d like (just remember to read the note we made on top of this form).'
                        value={formData.design_style}
                        onChange={handleChange}
                        rows={2}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="branding_materials" className="block font-semibold text-gray-900 dark:text-white">Do you have branding materials? (If no, what are you missing?)</label>
                    <textarea
                        id="branding_materials"
                        name="branding_materials"
                        placeholder='Logo, color scheme, fonts, etc.'
                        value={formData.branding_materials}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="inspiration" className="block font-semibold text-gray-900 dark:text-white">Websites/Apps You Like (Inspiration)</label>
                    <textarea
                        id="inspiration"
                        name="inspiration"
                        placeholder='List some websites (comma separated)'
                        value={formData.inspiration}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        rows={1}
                    ></textarea>
                </div>

                <div>
                    <label htmlFor="budget_range" className="block font-semibold text-gray-900 dark:text-white">Budget Range (USD)</label>
                    <input
                        type="text"
                        id="budget_range"
                        name="budget_range"
                        placeholder='this is optional - but it helps us understand if what you&apos;re looking for is going to be feasible'
                        value={formData.budget_range}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="timeline" className="block font-semibold text-gray-900 dark:text-white">Ideal Timeline</label>
                    <input
                        type="text"
                        id="timeline"
                        name="timeline"
                        placeholder='When would you -like- to have this project completed? We&apos;ll let you know if we can meet your deadline.'
                        value={formData.timeline}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label htmlFor="other_info" className="block font-semibold text-gray-900 dark:text-white">Other Information</label>
                    <textarea
                        id="other_info"
                        name="other_info"
                        placeholder='Feel free to write anything else you think we should know, or anything else, poetry, what you had for breakfast, etc.'
                        value={formData.other_info}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        rows={2}
                    ></textarea>
                </div>
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Full Name</label>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="shadow-sm w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold text-gray-900 dark:text-white">Would you like to create an account?</label>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="create_account"
                            checked={formData.create_account}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-gray-900 dark:text-white">Yes, I want to create an account</label>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default PublicOnboardingForm;