'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';
import { v4 as uuidv4 } from 'uuid';

type File = Database['public']['Tables']['files']['Row'];

// Extend the File type to include signedURL and category
type FileWithSignedURL = File & { signedURL: string; category: string };

const ClientFiles = () => {
    const [files, setFiles] = useState<FileWithSignedURL[]>([]);
    const [uploading, setUploading] = useState(false);
    const [fileDescription, setFileDescription] = useState('');
    const [category, setCategory] = useState('all');

    // Define the bucket name
    const BUCKET_NAME = 'client-files';

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                // Get the current user
                const { data: user, error: userError } = await supabase.auth.getUser();
                if (userError || !user) {
                    throw new Error('User not authenticated');
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

                const organizationId = profileData.organization_id;

                if (!organizationId) {
                    throw new Error('Organization ID not found');
                }

                // Fetch files for the organization
                const { data: filesData, error: filesError } = await supabase
                    .from('files')
                    .select('*')
                    .eq('organization_id', organizationId);

                if (filesError) {
                    throw new Error('Failed to fetch files');
                }

                // Generate signed URLs for the files
                const filesWithSignedUrls = await Promise.all(
                    filesData.map(async (file) => {
                        const { data, error } = await supabase.storage
                            .from(BUCKET_NAME)
                            .createSignedUrl(`public/${file.file_id}`, 60); // URL valid for 60 seconds

                        if (error) {
                            console.error('Error generating signed URL:', error);
                            throw error;
                        }

                        console.log(`Generated signed URL for file ${file.file_id}: ${data.signedUrl}`);
                        return { ...file, signedURL: data.signedUrl, category: file.category || 'content' };
                    })
                );

                setFiles(filesWithSignedUrls);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };

        fetchFiles();
    }, []);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            uploadFiles(filesArray);
        }
    };

    const uploadFiles = async (filesArray: globalThis.File[]) => {
        setUploading(true);
        try {
            // Get the current user
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error('User not authenticated');
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

            const organizationId = profileData.organization_id;

            if (!organizationId) {
                throw new Error('Organization ID not found');
            }

            for (const file of filesArray) {
                const fileId = uuidv4(); // Generate a UUID for the file_id
                console.log(`Uploading file: ${file.name} with fileId: ${fileId}`);
                const { data, error } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(`public/${fileId}`, file);

                if (error) {
                    console.error('Error uploading file:', error);
                    throw error;
                }

                const fileUrl = data?.path;
                console.log(`File uploaded successfully: ${fileUrl}`);

                if (!fileUrl) {
                    throw new Error('File upload failed, no path returned');
                }

                const { error: insertError } = await supabase.from('files').insert([
                    {
                        user_id: user.user.id,
                        organization_id: organizationId,
                        file_name: file.name,
                        file_id: fileId,
                        file_url: fileUrl,
                        file_description: fileDescription,
                        category: 'content', // Default category, can be changed as needed
                    },
                ]);

                if (insertError) {
                    console.error('Error inserting file record:', insertError);
                    throw insertError;
                }
            }

            // Update branding_content_uploaded to true
            const { error: updateProfileError } = await supabase
                .from('profiles')
                .update({ branding_content_uploaded: true })
                .eq('user_id', user.user.id);

            if (updateProfileError) {
                console.error('Error updating profile:', updateProfileError);
                throw updateProfileError;
            }

            // Refresh the files list
            const { data: filesData, error: filesError } = await supabase
                .from('files')
                .select('*')
                .eq('organization_id', organizationId);

            if (filesError) {
                throw new Error('Failed to fetch files');
            }

            // Generate signed URLs for the files
            const filesWithSignedUrls = await Promise.all(
                filesData.map(async (file) => {
                    const { data, error } = await supabase.storage
                        .from(BUCKET_NAME)
                        .createSignedUrl(`public/${file.file_id}`, 60); // URL valid for 60 seconds

                    if (error) {
                        console.error('Error generating signed URL:', error);
                        throw error;
                    }

                    console.log(`Generated signed URL for file ${file.file_id}: ${data.signedUrl}`);
                    return { ...file, signedURL: data.signedUrl, category: file.category || 'content' };
                })
            );

            setFiles(filesWithSignedUrls);
        } catch (error: any) {
            console.error('Error uploading files:', error);
            alert('Error uploading files: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteFile = async (fileId: string) => {
        try {
            const { error } = await supabase.from('files').delete().eq('file_id', fileId);
            if (error) {
                throw error;
            }

            // Refresh the files list
            const { data: user, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                throw new Error('User not authenticated');
            }

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.user.id)
                .single();

            if (profileError) {
                throw profileError;
            }

            const organizationId = profileData.organization_id;

            if (!organizationId) {
                throw new Error('Organization ID not found');
            }

            const { data: filesData, error: filesError } = await supabase
                .from('files')
                .select('*')
                .eq('organization_id', organizationId);

            if (filesError) {
                throw new Error('Failed to fetch files');
            }

            // Generate signed URLs for the files
            const filesWithSignedUrls = await Promise.all(
                filesData.map(async (file) => {
                    const { data, error } = await supabase.storage
                        .from(BUCKET_NAME)
                        .createSignedUrl(`public/${file.file_id}`, 60); // URL valid for 60 seconds

                    if (error) {
                        console.error('Error generating signed URL:', error);
                        throw error;
                    }

                    console.log(`Generated signed URL for file ${file.file_id}: ${data.signedUrl}`);
                    return { ...file, signedURL: data.signedUrl, category: file.category || 'content' };
                })
            );

            setFiles(filesWithSignedUrls);
        } catch (error: any) {
            console.error('Error deleting file:', error);
            alert('Error deleting file: ' + error.message);
        }
    };

    const filteredFiles = files.filter(file => category === 'all' || file.category === category);


    return (
        <>
            <div className="p-4 md:p-8">
                <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Upload Files</h1>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4 dark:text-white"
                />
                <input
                    type="text"
                    value={fileDescription}
                    onChange={(e) => setFileDescription(e.target.value)}
                    placeholder="File description"
                    className="mb-4 p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={() => uploadFiles([])}
                    disabled={uploading}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <div className="mt-8">
                    {/* Dropdown for mobile */}
                    <div className="block md:hidden mb-4">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 text-gray-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="all">All</option>
                            <option value="favorites">Favorites</option>
                            <option value="content">Content</option>
                            <option value="images">Images</option>
                            <option value="data-files">Data Files</option>
                        </select>
                    </div>
                    {/* Tabs for desktop */}
                    <div className="hidden md:flex rounded-t-md rounded-s-none mb-4 space-x-1">
                        <button
                            onClick={() => setCategory('all')}
                            className={`px-4 py-2 rounded-t-md ${category === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setCategory('favorites')}
                            className={`px-4 py-2 rounded-t-md ${category === 'favorites' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}`}
                        >
                            Favorites
                        </button>
                        <button
                            onClick={() => setCategory('content')}
                            className={`px-4 py-2 rounded-t-md ${category === 'content' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}`}
                        >
                            Content
                        </button>
                        <button
                            onClick={() => setCategory('images')}
                            className={`px-4 py-2 rounded-t-md ${category === 'images' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}`}
                        >
                            Images
                        </button>
                        <button
                            onClick={() => setCategory('data-files')}
                            className={`px-4 py-2 rounded-t-md ${category === 'data-files' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'}`}
                        >
                            Data Files
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredFiles.map((file) => (
                            <div key={file.file_id} className="border bg-white p-4 rounded shadow">
                                <h2 className="text-lg font-bold truncate text-gray-900">{file.file_name}</h2>
                                <p className="text-sm text-gray-900">{file.file_description}</p>
                                <p className="text-sm text-gray-900">{new Date(file.created_at!).toLocaleDateString()}</p>
                                <div className='flex justify-between items-center mt-4'>
                                    <a href={file.signedURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                        View File
                                    </a>
                                    <button
                                        onClick={() => handleDeleteFile(file.file_id)}
                                        className="bg-red-600 text-white py-1 px-2 rounded mt-2"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientFiles;