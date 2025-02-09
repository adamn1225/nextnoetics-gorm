'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';

interface OnboardingFormProps {
    onComplete: (formData: any) => void;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onComplete }) => {
    const [formData, setFormData] = useState({
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
        user_id: '',
        current_website: false,
        website_name: '',
        service_type: '', // Add service_type to formData
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                setError('User not authenticated');
                return;
            }

            setFormData((prev) => ({
                ...prev,
                user_id: user.user.id
            }));
        };

        fetchProfile();
    }, []);

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
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error('User not authenticated');
            }

            console.log('Submitting form data:', formData); // Log the form data for debugging

            const { data, error: formError } = await supabase.from('client_project_plan').insert([
                formData
            ]).select();

            if (formError) {
                throw formError;
            }

            const newRecord = data[0];
            setSuccessMessage('Your project plan has been successfully submitted!');
            onComplete(newRecord); // Pass the new record with the id to the onComplete handler

            // Upload the form data as a file to the client-files bucket
            const fileName = `onboarding_form_${newRecord.id}.json`;
            const fileContent = JSON.stringify(formData);
            const { error: uploadError } = await supabase.storage
                .from('client-files')
                .upload(`public/${fileName}`, fileContent, {
                    contentType: 'application/json',
                });

            if (uploadError) {
                throw uploadError;
            }

            // Fetch user profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.user.id)
                .single();

            if (profileError) {
                throw profileError;
            }

            // Add an entry to the files table
            const { error: fileError } = await supabase.from('files').insert([
                {
                    file_id: fileName,
                    file_name: fileName,
                    file_url: `public/${fileName}`,
                    user_id: user.user.id,
                    organization_id: profileData.organization_id,
                    file_description: 'Onboarding Form',
                    category: 'onboarding',
                },
            ]);

            if (fileError) {
                throw fileError;
            }

        } catch (error: any) {
            console.error('Error submitting form:', error.message); // Log the error for debugging
            alert('There was an error submitting the form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <>
            <div className="w-[70vw] h-fit mx-auto p-8 bg-white mt-12 mb-12 dark:bg-gray-700 rounded shadow">
                {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="space-y-2 w-full mt-12 mb-4">
                    <h1 className="text-2xl font-bold mt-6 text-gray-900 dark:text-white">Your Project Plan</h1>
                    <h3 className="text-lg font-bold mt-6 text-gray-700 dark:text-white">
                        Complete this form before entering your dashboard</h3>
                    <div className='flex flex-col gap-1 pt-8'>
                        <span className='font-extrabold text-xl underline underline-offset-4 dark:text-white'>Important: </span>
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default OnboardingForm;