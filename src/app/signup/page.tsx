'use client';

import React, { useState } from 'react';
import { supabase } from '@lib/supabaseClient';
import LandingNavigation from '@components/LandingNavigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isTokenSent, setIsTokenSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) {
            setError(signUpError.message);
        } else {
            const userId = signUpData.user?.id;

            if (userId) {
                // Create profile
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([{ user_id: userId, email, name: email.split('@')[0] }]);

                if (profileError) {
                    setError(profileError.message);
                    return;
                }

                // Create organization if not provided
                const orgName = organizationName || `${email.split('@')[0]}'s Organization`;
                const { data: orgData, error: orgError } = await supabase
                    .from('organizations')
                    .insert([{ name: orgName }])
                    .select()
                    .single();

                if (orgError) {
                    setError(orgError.message);
                } else {
                    const organizationId = orgData.id;

                    // Update profile with organization_id
                    const { error: profileUpdateError } = await supabase
                        .from('profiles')
                        .update({ organization_id: organizationId })
                        .eq('user_id', userId);

                    if (profileUpdateError) {
                        setError(profileUpdateError.message);
                    } else {
                        // Insert into organization_members table
                        const { error: memberError } = await supabase
                            .from('organization_members')
                            .insert([{ organization_id: organizationId, user_id: userId, role: 'client' }]);

                        if (memberError) {
                            setError(memberError.message);
                        } else {
                            setIsTokenSent(true);
                            setSuccessMessage('Signup successful! Please check your email for the 6-digit token.');
                        }
                    }
                }
            }
        }
    };

    const handleVerifyToken = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const { error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccessMessage('Email verified successfully! You can now log in.');
        }
    };

    const handleGoogleSignup = async () => {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://www.noetics.io/dashboard/tasks',
            },
        });

        if (signInError) {
            setError(signInError.message);
        } else {
            // Wait for the OAuth sign-in process to complete and fetch the user information
            const { data: userData, error: userError } = await supabase.auth.getUser();

            if (userError) {
                setError(userError.message);
            } else {
                const userId = userData.user?.id;
                const email = userData.user?.email;

                if (userId && email) {
                    // Create profile
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([{ user_id: userId, email, name: email.split('@')[0] }]);

                    if (profileError) {
                        setError(profileError.message);
                        return;
                    }

                    // Create organization if not provided
                    const orgName = `${email.split('@')[0]}'s Organization`;
                    const { data: orgData, error: orgError } = await supabase
                        .from('organizations')
                        .insert([{ name: orgName }])
                        .select()
                        .single();

                    if (orgError) {
                        setError(orgError.message);
                    } else {
                        const organizationId = orgData.id;

                        // Update profile with organization_id
                        const { error: profileUpdateError } = await supabase
                            .from('profiles')
                            .update({ organization_id: organizationId })
                            .eq('user_id', userId);

                        if (profileUpdateError) {
                            setError(profileUpdateError.message);
                        } else {
                            // Insert into organization_members table
                            const { error: memberError } = await supabase
                                .from('organization_members')
                                .insert([{ organization_id: organizationId, user_id: userId, role: 'client' }]);

                            if (memberError) {
                                setError(memberError.message);
                            } else {
                                setSuccessMessage('Signup successful! You can now log in.');
                            }
                        }
                    }
                }
            }
        }
    };

    const handleResendOtp = async () => {
        setError(null);
        setSuccessMessage(null);

        const { error } = await supabase.auth.resend({
            email,
            type: 'signup',
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccessMessage('OTP has been resent. Please check your email.');
        }
    };

    return (
        <>
            <LandingNavigation />
            <div className="bg-gray-200 dark:bg-zinc-700 min-h-screen flex items-center justify-center">
                <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded shadow">
                    <h1 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-secondary">Sign Up</h1>
                    {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}
                    {successMessage && <p className="text-green-600 dark:text-green-400 mb-4">{successMessage}</p>}
                    {!isTokenSent ? (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div>
                                <label htmlFor="organizationName" className="block font-medium text-zinc-900 dark:text-white">Organization Name (optional)</label>
                                <input
                                    type="text"
                                    id="organizationName"
                                    name="organizationName"
                                    placeholder='Your organization name (recommended)'
                                    value={organizationName}
                                    onChange={(e) => setOrganizationName(e.target.value)}
                                    className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block font-medium text-zinc-900 dark:text-white">Login Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Enter a valid email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                                    required
                                />
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block font-medium text-zinc-900 dark:text-white">Password</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder='At least 8 characters'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="shadow-sm w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 top-1/3 right-0 pr-3 flex items-center text-zinc-500"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            <div className="relative">
                                <label htmlFor="confirmPassword" className="block font-medium text-zinc-900 dark:text-white">Confirm Password</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder='Confirm your password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="shadow-sm w-full p-2 border rounded bg-zinc-100 text-zinc-900"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 top-1/3 right-0 pr-3 flex items-center text-zinc-500"
                                >
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="shadow-md dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                            >
                                Sign Up
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyToken} className="space-y-4">
                            <div>
                                <label htmlFor="token" className="block font-medium text-zinc-900 dark:text-white">6-Digit Token</label>
                                <input
                                    type="text"
                                    id="token"
                                    name="token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="w-full p-2 border rounded bg-zinc-100 dark:bg-zinc-700 dark:text-white"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="shadow-md bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                            >
                                Verify Token
                            </button>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="mt-4 shadow-md bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 w-full"
                            >
                                Resend OTP
                            </button>
                        </form>
                    )}
                    <div className="mt-6">
                        <button
                            type="button" // Change to type="button" to prevent form submission
                            onClick={handleGoogleSignup}
                            className="flex items-center shadow-md justify-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 w-full"
                        >
                            <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                                <path fill="#4285F4" d="M24 9.5c3.1 0 5.7 1.1 7.8 3.1l5.8-5.8C33.9 3.5 29.3 1.5 24 1.5 14.8 1.5 7.3 7.9 4.5 16.1l6.9 5.4C13.1 15.1 18 9.5 24 9.5z" />
                                <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3.1-2.4 5.7-4.9 7.4l7.5 5.8c4.4-4.1 7.2-10.1 7.2-17.7z" />
                                <path fill="#FBBC05" d="M11.4 28.5c-1-3.1-1-6.4 0-9.5l-6.9-5.4C1.2 17.1 0 20.4 0 24s1.2 6.9 3.5 10l7.9-5.5z" />
                                <path fill="#EA4335" d="M24 46.5c5.3 0 9.9-1.8 13.2-4.9l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6 0-11-4.1-12.8-9.6l-7.9 5.5c3.2 6.3 9.7 10.6 17.7 10.6z" />
                                <path fill="none" d="M0 0h48v48H0z" />
                            </svg>
                            Sign Up with Google
                        </button>
                        <p className="text-lg text-center mt-8">
                            <Link className='underline text-normal' href="/privacy-policy">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default SignupPage;