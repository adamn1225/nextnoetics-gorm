'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';

const ClientTasks = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newNote, setNewNote] = useState('');
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [profile, setProfile] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

useEffect(() => {
    const fetchTasks = async () => {
        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) throw new Error("User ID not found");

            // ✅ Fetch user profile
            const profileRes = await fetch(`http://localhost:5000/api/profiles/${userId}`);
            const profileData = await profileRes.json();
            if (!profileData.organization_id) throw new Error("Organization ID not found");

            setProfile(profileData);

            // ✅ Fetch user tasks (Go backend will create default tasks if needed)
            const tasksRes = await fetch(`http://localhost:5000/api/tasks?organization_id=${profileData.organization_id}&user_id=${userId}`);
            const tasks = await tasksRes.json();

            // ✅ Show only incomplete tasks
            const pendingTasks = tasks.filter((task) => task.status !== "Completed");
            setTasks(pendingTasks);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchTasks();
}, []);




const handleAddNote = async (taskId: number) => {
    if (!newNote.trim()) return;

    try {
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notes: newNote }),
        });

        if (!response.ok) throw new Error("Failed to update task");

        setTasks(tasks.map(task => task.id === taskId ? { ...task, notes: newNote } : task));
        setNewNote('');
        setSelectedTaskId(null);
    } catch (error: any) {
        setError(error.message);
    }
};



const handleTaskRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim() || !taskDescription.trim()) {
        setError("Please fill in all required fields.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: taskTitle,
                description: taskDescription,
                due_date: taskDueDate,
                is_request: true,
                status: "Pending",
                organization_id: profile.organization_id,
                task_type: "client",
            }),
        });

        if (!response.ok) throw new Error("Failed to submit task");

        alert("Task request submitted successfully.");
        setIsModalOpen(false);
        fetchTasks(); // Refresh task list
    } catch (error: any) {
        setError(error.message);
    }
};

    const clientTasks = tasks.filter(task => task.task_type === 'client');
    const developerTasks = tasks.filter(task => task.task_type === 'developer');
    const taskRequests = tasks.filter(task => task.is_request);

    return (
        <>
            <div className='px-4 py-6 md:px-8 md:py-12 text-gray-950 dark:text-primary'>
                <h1 className="text-2xl font-bold mb-4 text-gray-950 dark:text-white">Your Tasks</h1>
                <div className='container mx-auto'>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 bg-white dark:bg-stone-700 dark:text-white divide-y divide-gray-200">
                            <thead className="dark:bg-zinc-800">
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Title</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Description</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Status</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Due Date</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Notes</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border border-gray-200 divide-gray-200">
                                {clientTasks.map((task) => (
                                    <tr key={task.id} className="divide-x divide-gray-200">
                                        <td className="py-2 px-4 whitespace-nowrap text-center">{task.title}</td>
                                        <td className="py-2 px-4 text-center">
                                            <div dangerouslySetInnerHTML={{ __html: task.description || '' }}></div>
                                        </td>
                                        <td className="py-2 px-4 whitespace-nowrap text-center">{task.status}</td>
                                        <td className="py-2 px-4 text-center">{task.due_date ? new Date(task.due_date).toLocaleString() : 'No due date'}</td>
                                        <td className="py-2 px-4 text-center">{task.notes}</td>
                                        <td className="py-2 px-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => setSelectedTaskId(task.id)}
                                                className="bg-blue-500 text-white py-1 px-2 rounded"
                                            >
                                                Add Note
                                            </button>
                                            {selectedTaskId === task.id && (
                                                <div className="mt-4">
                                                    <textarea
                                                        value={newNote}
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                        placeholder="Add a note"
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                    />
                                                    <button
                                                        onClick={() => handleAddNote(task.id)}
                                                        className="bg-green-600 text-white py-1 px-2 rounded mt-2"
                                                    >
                                                        Save Note
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">Developer Tasks</h2>
                <div className='container mx-auto'>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 bg-white dark:bg-stone-700 dark:text-white divide-y divide-gray-200">
                            <thead className="dark:bg-zinc-800">
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Title</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Description</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Status</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Due Date</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Notes</th>
                                    <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y border border-gray-200 divide-gray-200">
                                {developerTasks.map((task) => (
                                    <tr key={task.id} className="divide-x divide-gray-200">
                                        <td className="py-2 px-4 whitespace-nowrap text-center">{task.title}</td>
                                        <td className="py-2 px-4 text-center">
                                            <div dangerouslySetInnerHTML={{ __html: task.description || '' }}></div>
                                        </td>
                                        <td className="py-2 px-4 whitespace-nowrap text-center">{task.status}</td>
                                        <td className="py-2 px-4 text-center">{task.due_date ? new Date(task.due_date).toLocaleString() : 'No due date'}</td>
                                        <td className="py-2 px-4 text-center">{task.notes}</td>
                                        <td className="py-2 px-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => setSelectedTaskId(task.id)}
                                                className="bg-primary text-white py-1 px-2 rounded"
                                            >
                                                Add Note
                                            </button>
                                            {selectedTaskId === task.id && (
                                                <div className="mt-4">
                                                    <textarea
                                                        value={newNote}
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                        placeholder="Add a note"
                                                        className="w-full p-2 border border-gray-300 rounded"
                                                    />
                                                    <button
                                                        onClick={() => handleAddNote(task.id)}
                                                        className="bg-green-600 text-white py-1 px-2 rounded mt-2"
                                                    >
                                                        Save Note
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mt-8 mb-4 dark:text-white">Request a Task</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Request a Task
                </button>
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4">
                            <h2 className="text-xl font-bold mb-4">Request a Task</h2>
                            <form onSubmit={handleTaskRequest} className="flex flex-col gap-6">
                                <div className="mb-4 flex flex-col gap-1">
                                    <label className="block text-sm font-medium text-gray-700">Task title
                                        <input
                                            type="text"
                                            value={taskTitle}
                                            onChange={(e) => setTaskTitle(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        /></label>
                                    <label className="block text-sm font-medium text-gray-700">Description
                                        <textarea
                                            value={taskDescription}
                                            onChange={(e) => setTaskDescription(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            required
                                        /></label>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Requested Due Date</label>
                                    <input
                                        type="datetime-local"
                                        value={taskDueDate}
                                        onChange={(e) => setTaskDueDate(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-600 text-white py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-700 text-white py-2 px-4 rounded"
                                    >
                                        Submit Task Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">Requested Tasks</h2>
                    <div className='container mx-auto'>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 bg-white dark:bg-stone-700 dark:text-white divide-y divide-gray-200">
                                <thead className="dark:bg-zinc-800">
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Title</th>
                                        <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Description</th>
                                        <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Requested Due Date</th>
                                        <th className="py-2 px-4 border-b border-gray-200 whitespace-nowrap">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y border border-gray-200 divide-gray-200">
                                    {taskRequests.map((taskRequest) => (
                                        <tr key={taskRequest.id} className="divide-x divide-gray-200">
                                            <td className="py-2 px-4 whitespace-nowrap text-center">{taskRequest.title}</td>
                                            <td className="py-2 px-4 text-center">{taskRequest.description}</td>
                                            <td className="py-2 px-4 text-center">{taskRequest.due_date ? new Date(taskRequest.due_date).toLocaleString() : 'No due date'}</td>
                                            <td className="py-2 px-4 text-center">{taskRequest.status || 'Pending'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </ >
    );
};

export default ClientTasks;