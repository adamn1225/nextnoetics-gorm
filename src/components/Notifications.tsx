'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { BellIcon } from 'lucide-react';

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) {
                console.error('User not authenticated');
                return;
            }

            const { data: notifications, error: notificationsError } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (notificationsError) {
                console.error('Failed to fetch notifications', notificationsError);
                return;
            }

            setNotifications(notifications);
        };

        fetchNotifications();
    }, []);

    return (
        <div className="relative">
            <BellIcon
                className="h-8 w-8 text-white dark:text-white cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {notifications.some(notification => !notification.is_read) && (
                <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
            )}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        {notifications.length === 0 ? (
                            <p className="text-gray-600">No notifications</p>
                        ) : (
                            <ul className="space-y-2">
                                {notifications.map(notification => (
                                    <li key={notification.id} className="p-2 border-b border-gray-200">
                                        <p className="text-sm font-medium">{notification.title}</p>
                                        <p className="text-sm text-gray-600">{notification.message}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;