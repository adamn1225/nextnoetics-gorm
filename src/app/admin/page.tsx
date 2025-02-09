'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Database } from '@lib/database.types';
import AdminLayout from './AdminLayout';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TaskWithClient extends Task {
    client_name: string | null;
}

const AdminDashboardPage = () => {
    const [tasks, setTasks] = useState<TaskWithClient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const { data, error } = await supabase
                    .from('tasks')
                    .select(`
                        *,
                        profiles!inner(name)
                    `)
                    .not('due_date', 'is', null)
                    .order('due_date', { ascending: true });

                if (error) {
                    throw error;
                }

                const tasksWithClient = data.map((task: any) => ({
                    ...task,
                    client_name: task.profiles.name,
                }));

                setTasks(tasksWithClient || []);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const getPriorityColor = (dueDate: string) => {
        const now = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
            return 'bg-red-500';
        } else if (diffDays <= 3) {
            return 'bg-amber-400';
        } else if (diffDays <= 6) {
            return 'bg-yellow-500';
        } else {
            return 'bg-green-600';
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <AdminLayout>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Priority</th>
                            <th className="py-2 px-4 border-b">Task</th>
                            <th className="py-2 px-4 border-b">Description</th>
                            <th className="py-2 px-4 border-b">Due Date</th>
                            <th className="py-2 px-4 border-b">Status</th>
                            <th className="py-2 px-4 border-b">Notes</th>
                            <th className="py-2 px-4 border-b">Client Name</th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-400'>
                        {tasks.map((task) => (
                            <tr key={task.id} className="text-gray-950 font-semibold">
                                <td className="py-2 px-4 border-b text-center">
                                    <span className={`inline-block w-4 h-4 rounded-full ${getPriorityColor(task.due_date || '')}`}></span>
                                </td>
                                <td className="py-2 px-4 border-b text-center">{task.title}</td>
                                <td className="py-2 px-4 border-b text-center">{task.description}</td>
                                <td className="py-2 px-4 border-b text-center">{task.due_date ? new Date(task.due_date).toLocaleString() : 'No due date'}</td>
                                <td className="py-2 px-4 border-b text-center">{task.status}</td>
                                <td className="py-2 px-4 border-b text-center">{task.notes}</td>
                                <td className="py-2 px-4 border-b text-center">{task.client_name}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};


export default AdminDashboardPage;