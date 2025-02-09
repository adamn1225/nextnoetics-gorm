"use client";
import React, { useState } from "react";
import { supabase } from "@lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(true); // Add state to track verification status

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting to log in...");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("Login successful, fetching user profile...");
      // Fetch the user's profile to determine their role
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        throw new Error("No profile data found");
      }

      // Check if the user is verified
      if (!authData.user || !authData.user.email_confirmed_at) {
        setIsVerified(false);
        throw new Error("Please verify your email to continue.");
      }

      console.log("Profile data found, redirecting...");
      // Redirect based on user role
      if (profileData.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard/tasks");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      setError("");

      const { error } = await supabase.auth.resend({
        type: "signup", // Add the type property
        email,
      });

      if (error) throw error;

      setError("Verification email resent. Please check your inbox.");
    } catch (err: any) {
      console.error("Resend verification failed:", err);
      setError(err.message || "Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://www.noetics.io/dashboard/tasks',
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        setError(userError.message);
        return;
      }

      const userId = userData.user?.id;
      const userEmail = userData.user?.email;

      if (userId && userEmail) {
        // Check if user already exists in profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(); // Use maybeSingle to handle zero or one row

        if (profileError) {
          setError(profileError.message);
          return;
        }

        if (!profileData) {
          // Insert user into profiles table
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ user_id: userId, email: userEmail, name: userEmail.split('@')[0] }]);

          if (insertError) {
            setError(insertError.message);
            return;
          }

          // Create organization if not provided
          const orgName = `${userEmail.split('@')[0]}'s Organization`;
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .insert([{ name: orgName }])
            .select()
            .single();

          if (orgError) {
            setError(orgError.message);
            return;
          }

          const organizationId = orgData.id;

          // Update profile with organization_id
          const { error: profileUpdateError } = await supabase
            .from('profiles')
            .update({ organization_id: organizationId })
            .eq('user_id', userId);

          if (profileUpdateError) {
            setError(profileUpdateError.message);
            return;
          }

          // Insert into organization_members table
          const { error: memberError } = await supabase
            .from('organization_members')
            .insert([{ organization_id: organizationId, user_id: userId, role: 'client' }]);

          if (memberError) {
            setError(memberError.message);
            return;
          }
        }

        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error("Google login failed:", err);
      setError(err.message || "Failed to log in with Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-700">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md w-5/6 md:w-full max-w-md">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white text-center mb-6">
          Client Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full text-zinc-900 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-900 dark:text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border text-zinc-900 border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 top-1/3 right-0 pr-3 flex items-center text-zinc-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
              <Link href="/reset-password">Forgot Password?</Link>
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="onboardbutton flex justify-center w-full text-white font-bold py-3 px-6 rounded-lg"
          >
            {loading ? "Logging in..." : "Log In"}
            <div className="arrow-wrapper">
              <div className="arrow"></div>
            </div>
          </button>
          {!isVerified && (
            <div className="mt-4 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-50">Didn&quot;t receive the verification email?</p>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={loading}
                className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Resend Verification Email
              </button>
            </div>
          )}
          <div className="mt-6">
            <button
              type="button" // Change to type="button" to prevent form submission
              onClick={handleGoogleLogin}
              className="flex items-center shadow-md justify-center bg-white border border-zinc-300 text-zinc-700 px-4 py-2 rounded hover:bg-zinc-100 w-full"
            >
              <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
                <path fill="#4285F4" d="M24 9.5c3.1 0 5.7 1.1 7.8 3.1l5.8-5.8C33.9 3.5 29.3 1.5 24 1.5 14.8 1.5 7.3 7.9 4.5 16.1l6.9 5.4C13.1 15.1 18 9.5 24 9.5z" />
                <path fill="#34A853" d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3.1-2.4 5.7-4.9 7.4l7.5 5.8c4.4-4.1 7.2-10.1 7.2-17.7z" />
                <path fill="#FBBC05" d="M11.4 28.5c-1-3.1-1-6.4 0-9.5l-6.9-5.4C1.2 17.1 0 20.4 0 24s1.2 6.9 3.5 10l7.9-5.5z" />
                <path fill="#EA4335" d="M24 46.5c5.3 0 9.9-1.8 13.2-4.9l-7.5-5.8c-2.1 1.4-4.7 2.2-7.7 2.2-6 0-11-4.1-12.8-9.6l-7.9 5.5c3.2 6.3 9.7 10.6 17.7 10.6z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Log In with Google
            </button>
          </div>
          <p className="text-lg text-center text-blue-500 hover:text-blue-500 dark:hover:text-blue-500 dark:text-blue-400 underline ">
            <Link href="/">Go back to homepage</Link>
          </p>
          <p className="text-lg text-center">
            <Link className='underline text-sm text-blue-500 hover:text-blue-500 dark:hover:text-blue-400 dark:text-blue-300' href="/privacy-policy">
              Privacy Policy
            </Link>
          </p>
        </form>

      </div>

    </div>
  );
};

export default LoginPage;