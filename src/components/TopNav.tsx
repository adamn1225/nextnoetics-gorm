'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import Image from 'next/image';
import Notifications from '@components/Notifications';

const TopNav: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error('User not authenticated');
                return;
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (profileError || !profile) {
                console.error('Failed to fetch user profile', profileError);
                return;
            }

            // Check if the user signed in with Google SSO and has a profile picture URL
            if (user.user_metadata.avatar_url && !profile.profile_image) {
                try {
                    const response = await fetch(user.user_metadata.avatar_url);
                    const blob = await response.blob();
                    const fileName = `${user.id}.jpg`;

                    const { error: uploadError } = await supabase.storage
                        .from('profile-pictures')
                        .upload(fileName, blob, {
                            cacheControl: '3600',
                            upsert: true,
                        });

                    if (uploadError) {
                        throw uploadError;
                    }

                    const { data: publicUrlData } = supabase.storage
                        .from('profile-pictures')
                        .getPublicUrl(fileName);

                    const publicUrl = publicUrlData.publicUrl;

                    // Update the profile with the new profile image URL
                    const { error: updateError } = await supabase
                        .from('profiles')
                        .update({ profile_image: publicUrl })
                        .eq('user_id', user.id);

                    if (updateError) {
                        throw updateError;
                    }

                    profile.profile_image = publicUrl;
                } catch (error) {
                    console.error('Error uploading profile picture:', error);
                }
            }

            setProfile(profile);
        };

        fetchUserProfile();
    }, []);

    return (
        <div className="flex justify-end items-center gap-6 p-4 bg-white shadow-md pr-12 dark:bg-gray-900 ">
            <Notifications />
            {profile && profile.profile_image ? (
                <Image
                    src={profile.profile_image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="h-9 w-9 rounded-full object-cover shadow-md"
                />
            ) : (
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
            )}
        </div>
    );
};

export default TopNav;