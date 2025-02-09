'use client';
import React, { useState, useEffect, useTransition } from 'react';
import { Home, Folder, ClipboardList, BarChart, User, LogOut, Settings, Calendar, MonitorCog } from 'lucide-react';
import { supabase } from '@lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import placeholderAvatar from '@public/placeholder-avatar.png';
import nextlogo from '@public/next_noetics.png';
import DarkModeToggle from './DarkModeToggle';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: Home },
  { name: 'File Uploads', href: '/dashboard/files', icon: Folder },
  { name: 'Tasks', href: '/dashboard/tasks', icon: ClipboardList },
  { name: 'CMS', href: '/dashboard/content', icon: MonitorCog },
  { name: 'Calendar', href: '/dashboard/smcalendar', icon: Calendar },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
  { name: 'Profile', href: '/dashboard/profile', icon: User },
];

interface Profile {
  user_id: string;
  profile_image?: string;
  name?: string;
}

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentPath = usePathname();

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

      // Ensure user_id is a string
      if (profile.user_id) {
        setProfile(profile as Profile);
      } else {
        console.error('Invalid user_id');
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    setLoading(isPending);
  }, [isPending]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      startTransition(() => {
        router.push('/login');
      });
    } else {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <aside className={`bg-gray-900 dark:bg-gray-900 pb-28 text-white transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-44'} overflow-hidden relative`}>
      {loading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-700 animate-pulse"></div>
      )}
      <div className='flex items-center justify-start gap-1 w-full py-4 pr-4 pl-1'>
        <Image
          src={nextlogo}
          alt="Noetics.io Logo"
          width={140} // Adjust the width as needed
          height={100} // Adjust the height as needed
          className="rounded-full"
        />
      </div>
      <div className="flex items-center justify-between pl-4">
        <h2 className={`text-xl font-bold transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
          Dashboard
        </h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white font-extra flex justify-center w-full bold text-xl focus:outline-none underline"
          style={{ zIndex: 10 }}
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </div>
      <div className="flex flex-col justify-start gap-1 items-start p-4">

        <div className={` ${isCollapsed ? 'hidden' : 'flex flex-nowrap justify-center w-full gap-1'}`}>
          <p className="text-sm 2xl:text-base font-semibold">Welcome</p>
          <p className="text-sm 2xl:text-base font-bold">{profile?.name}</p>
        </div>
        <span className=" inline-flex justify-center w-full items-center">
          <DarkModeToggle />
        </span>
      </div>
      <nav className="flex flex-col justify-between h-full pb-8  text-xs xl:text-base">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2  text-xs 2xl:text-base">
              <Link href={item.href} passHref className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-2'} p-2 font-medium hover:bg-gray-700 rounded ${currentPath === item.href ? 'active' : ''}`}>
                <item.icon className="mr-2" />
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="xl:mb-12 text-xs xl:text-base">
          <ul className={`flex flex-col gap-1 ${isCollapsed ? 'items-center' : 'items-start 2xl:ml-2'}`}>
            <li className="text-xs 2xl:text-base">
              <Link href="/dashboard/settings" passHref className={`flex items-center${isCollapsed ? 'justify-center' : 'justify-start gap-2'}  p-2 font-medium hover:bg-gray-700 rounded ${currentPath === '/dashboard/settings' ? 'active' : ''}`}>
                <Settings className="mr-2 " />
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Settings</span>
              </Link>
            </li>
            <li className="mb-2 text-xs 2xl:text-base">
              <button onClick={handleLogout} className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start gap-2'}  p-2 font-medium hover:bg-gray-700 rounded`}>
                <LogOut className="mr-2" />
                <span className={`${isCollapsed ? 'hidden' : 'block'}`}>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;