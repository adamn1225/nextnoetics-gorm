'use client';
import React, { useState } from "react";
import { supabase } from "@lib/supabaseClient";

const AddAccessToken = () => {
    const [formValues, setFormValues] = useState({
        platform: '',
        access_token: '',
    });
    const [loading, setLoading] = useState(false);

    const handleAddToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { platform, access_token } = formValues;
        const user_id = "current-user-id"; // Replace with actual user ID

        const { data, error } = await supabase.from("user_tokens").insert([
            { user_id, platform, access_token },
        ]);

        setLoading(false);

        if (error) {
            console.error("Error adding access token:", error);
        } else {
            console.log("Access token added successfully");
            setFormValues({ platform: '', access_token: '' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handleAddToken} className="space-y-4">
            <div>
                <label htmlFor="platform" className="block text-sm font-medium  text-gray-950 dark:text-primary">
                    Platform
                </label>
                <select
                    id="platform"
                    name="platform"
                    value={formValues.platform}
                    onChange={handleChange}
                    className="mt-1 block text-gray-950 dark:text-primary w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                >
                    <option value="">Select Platform</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="TikTok">TikTok</option>
                </select>
            </div>
            <div>
                <label htmlFor="access_token" className="block text-sm font-medium  text-gray-950 dark:text-primary">
                    Access Token
                </label>
                <input
                    type="text"
                    id="access_token"
                    name="access_token"
                    value={formValues.access_token}
                    onChange={handleChange}
                    className="mt-1 block text-gray-950 dark:text-primary w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                />
            </div>
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
                disabled={loading}
            >
                {loading ? 'Adding...' : 'Add Access Token'}
            </button>
        </form>
    );
};

export default AddAccessToken;