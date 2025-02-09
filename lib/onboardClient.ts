import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';

export const onboardNewClient = async (email: string, password: string, profileData: Partial<Database['public']['Tables']['profiles']['Insert']>) => {
    // Step 1: Create the user in the auth.users table
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) {
        if (signUpError.message === "User already registered") {
            console.warn('User already registered, proceeding to create profile.');
            // Fetch the existing user
            const { data: { user: existingUser }, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                console.error('Error fetching existing user:', signInError.message);
                return;
            }

            // Check if the profile already exists
            const { data: existingProfile, error: fetchProfileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', email)
                .single();

            if (fetchProfileError && fetchProfileError.code !== 'PGRST116') {
                console.error('Error fetching existing profile:', fetchProfileError.message);
                return;
            }

            if (existingProfile) {
                console.warn('Profile already exists, updating profile.');
                // Update the existing profile
                const { error: updateProfileError } = await supabase
                    .from('profiles')
                    .update(profileData)
                    .eq('email', email);

                if (updateProfileError) {
                    console.error('Error updating profile:', updateProfileError.message);
                    return;
                }

                console.log('Client profile updated successfully.');
                return;
            }

            // Proceed to create the profile with the existing user id
            const { error: profileError } = await supabase.from('profiles').insert([
                {
                    ...profileData,
                    email, // Ensure email is included
                    name: profileData.name || '', // Ensure name is included
                    user_id: existingUser?.id, // Use the existing user id from auth.users
                },
            ]);

            if (profileError) {
                console.error('Error creating profile:', profileError.message);
                return;
            }

            console.log('Client onboarded successfully with existing user.');
            return;
        } else {
            console.error('Error creating user:', signUpError.message);
            return;
        }
    }

    // Step 2: Insert the user into the profiles table
    const { error: profileError } = await supabase.from('profiles').insert([
        {
            ...profileData,
            email, // Ensure email is included
            name: profileData.name || '', // Ensure name is included
            user_id: user?.id, // Use the generated user id from auth.users
        },
    ]);

    if (profileError) {
        console.error('Error creating profile:', profileError.message);
        return;
    }

    console.log('Client onboarded successfully');
};