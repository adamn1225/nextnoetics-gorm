'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import AddAccessToken from '@components/AddAccessToken';
import { Database } from '@lib/database.types';
import { X, CircleX } from 'lucide-react';

const localizer = momentLocalizer(moment);

type SMMEvent = Database['public']['Tables']['smm_calendar']['Row'] & {
    start: Date;
    end: Date;
};

const SMMCalendar = () => {
    const [events, setEvents] = useState<SMMEvent[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] = useState(false);
    const [isAccessTokenModalVisible, setIsAccessTokenModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<SMMEvent | null>(null);
    const [formValues, setFormValues] = useState<Partial<Database['public']['Tables']['smm_calendar']['Insert']>>({
        title: '',
        description: '',
        post_due_date: '',
        sm_platform: 'Facebook',
        status: 'Draft',
        post_automatically: false,
        blog_post_id: '',
    });

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase.from("smm_calendar").select("*");
            if (error) {
                console.error("Error fetching events:", error);
            } else {
                setEvents(data.map((event: Database['public']['Tables']['smm_calendar']['Row']) => ({
                    ...event,
                    start: new Date(event.post_due_date),
                    end: new Date(event.post_due_date),
                })));
            }
        };
        fetchEvents();

        const fetchPosts = async () => {
            const { data, error } = await supabase.from("blog_posts").select("id, title");
            if (error) {
                console.error("Error fetching posts:", error);
            } else {
                setPosts(data);
            }
        };
        fetchPosts();
    }, []);

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const { title, description, post_due_date, sm_platform, status, post_automatically, blog_post_id } = formValues;
        const { data: { user } } = await supabase.auth.getUser(); // Get the authenticated user
        if (!user) {
            console.error("User not authenticated");
            return;
        }
        const user_id = user.id; // Get the user ID from the authenticated user

        // Ensure all required fields are defined
        if (!title || !description || !post_due_date || !sm_platform || !status) {
            console.error("Missing required fields");
            return;
        }

        const { data, error } = await supabase.from("smm_calendar").insert([
            { title, description, post_due_date, sm_platform, status, post_automatically, user_id, blog_post_id: blog_post_id || null },
        ]);

        if (error) {
            console.error("Error adding event:", error);
        } else {
            if (data) {
                setEvents([...data, ...events.map((event: Database['public']['Tables']['smm_calendar']['Row']) => ({
                    ...event,
                    start: new Date(event.post_due_date),
                    end: new Date(event.post_due_date),
                }))]);
            }
            setIsModalVisible(false);
            setFormValues({
                title: '',
                description: '',
                post_due_date: '',
                sm_platform: 'Facebook',
                status: 'Draft',
                post_automatically: false,
                blog_post_id: '',
            });
        }
    };

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const { title, description, post_due_date, sm_platform, status, post_automatically, blog_post_id } = formValues;
        const { data, error } = await supabase
            .from("smm_calendar")
            .update({ title, description, post_due_date, sm_platform, status, post_automatically, blog_post_id: blog_post_id || null })
            .eq("id", selectedEvent!.id);

        if (error) {
            console.error("Error updating event:", error);
        } else {
            setEvents(events.map((event) => (event.id === selectedEvent!.id ? { ...event, ...formValues, start: new Date(formValues.post_due_date!), end: new Date(formValues.post_due_date!) } : event)));
            setIsEventDetailsModalVisible(false);
            setSelectedEvent(null);
        }
    };

    const handleDeleteEvent = async () => {
        const { error } = await supabase.from("smm_calendar").delete().eq("id", selectedEvent!.id);

        if (error) {
            console.error("Error deleting event:", error);
        } else {
            setEvents(events.filter((event) => event.id !== selectedEvent!.id));
            setIsEventDetailsModalVisible(false);
            setSelectedEvent(null);
        }
    };

    const handleEventClick = (event: SMMEvent) => {
        setSelectedEvent(event);
        setFormValues(event);
        setIsEventDetailsModalVisible(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-4"
        >
            <style jsx>{`
                .modal {
                    display: flex;
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    background-color: rgba(0, 0, 0, 0.5);
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background-color: #fff;
                    padding: 20px;
                    border: 1px solid #888;
                    width: 80%;
                    max-width: 500px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                }
                .close {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                }
                .close:hover,
                .close:focus {
                    color: black;
                    text-decoration: none;
                    cursor: pointer;
                }
            `}</style>
            <div className="flex flex-col-reverse justify-center gap-4 mx-12">

                <div className="flex-1 ">
                    <h2 className="text-4xl font-semibold my-4 text-gray-800 dark:text-white text-center">
                        Social Media Calendar
                    </h2>
                    <div className="flex items-end justify-between mb-10 w-full">
                        <div className="bg-white dark:bg-zinc-800 px-2 py-4 shadow-md mt-3 flex flex-col items-start justify-start gap-2 rounded-md">
                        <h2 className="text-base font-semibold text-center text-gray-800 dark:text-white">
                            Add an event to any of your social media platforms
                        </h2>
                            <button
                                className="text-lg onboardbutton text-white px-3 py-1 inline-flex justify-center w-full shadow-md rounded-md"
                                onClick={() => setIsModalVisible(true)}
                            >
                                Add SMM Event
                            </button>
                        </div>
                     <div className="bg-white dark:bg-zinc-800 px-2 py-4 shadow-md mt-3 flex flex-col items-start justify-start gap-2 rounded-md">
                        <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-white">
                            Connect to Your Social Media Platforms
                        </h2>
                        <button
                            className="text-base bg-blue-500 mv-2 self-center text-white font-semibold px-3 py-1 shadow-md rounded-md"
                            onClick={() => setIsAccessTokenModalVisible(true)}
                        >
                            Add Access Token
                        </button>
                    </div>
                    </div>
                    <div className="p-1 text-nowrap rounded-lg text-gray-900  dark:text-foreground w-auto">
                        <div style={{ height: 500, width: '100%' }}>
                            <Calendar
                                localizer={localizer}
                                events={events as unknown as Event[]}
                                startAccessor="start"
                                endAccessor="end"
                                onSelectEvent={(event) => handleEventClick(event as unknown as SMMEvent)}
                            />
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/6">
 
                </div>
            </div>

            {isModalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <span className="text-gray-600 dark:text-gray-300 cursor-pointer float-right mb-2" onClick={() => setIsModalVisible(false)}><CircleX /></span>
                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formValues.title || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-950 dark:text-primary dark:text-gray-300">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formValues.description || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-1 text-gray-950 dark:text-primary block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="post_due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post Due Date</label>
                                <input
                                    type="datetime-local"
                                    id="post_due_date"
                                    name="post_due_date"
                                    value={formValues.post_due_date || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-1 text-gray-950 dark:text-primary block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="sm_platform" className="block text-sm font-medium text-gray-950 dark:text-primary dark:text-gray-300">Social Media Platform</label>
                                <select
                                    id="sm_platform"
                                    name="sm_platform"
                                    value={formValues.sm_platform || 'Facebook'}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-1 block w-full border text-gray-950 dark:text-primary border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Facebook">Facebook</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="TikTok">TikTok</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-950 dark:text-primary">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formValues.status || 'Draft'}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-1 text-gray-950 dark:text-primary block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="post_automatically" className="block text-sm font-medium  text-gray-950 dark:text-primary mr-2">Auto Post?</label>
                                <input
                                    type="checkbox"
                                    id="post_automatically"
                                    name="post_automatically"
                                    checked={formValues.post_automatically || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="blog_post_id" className="block text-sm font-medium  text-gray-950 dark:text-primary">Blog Post</label>
                                <select
                                    id="blog_post_id"
                                    name="blog_post_id"
                                    value={formValues.blog_post_id || ''}
                                    onChange={handleChange}
                                    className="mt-1 p-1 block w-full text-gray-950 dark:text-primary border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">None</option>
                                    {posts.map((post) => (
                                        <option key={post.id} value={post.id}>
                                            {post.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-500">Add Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEventDetailsModalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <span className="text-gray-600 dark:text-gray-300 cursor-pointer float-right mb-2" onClick={() => setIsEventDetailsModalVisible(false)}><CircleX /></span>
                        <form onSubmit={handleUpdateEvent} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formValues.title || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formValues.description || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="post_due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post Due Date</label>
                                <input
                                    type="datetime-local"
                                    id="post_due_date"
                                    name="post_due_date"
                                    value={formValues.post_due_date || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="sm_platform" className="block text-sm font-medium  text-gray-950 dark:text-primary">Social Media Platform</label>
                                <select
                                    id="sm_platform"
                                    name="sm_platform"
                                    value={formValues.sm_platform || 'Facebook'}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-1 block text-gray-950 dark:text-primary w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Facebook">Facebook</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="TikTok">TikTok</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formValues.status || 'Draft'}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="post_automatically" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Auto Post?</label>
                                <input
                                    type="checkbox"
                                    id="post_automatically"
                                    name="post_automatically"
                                    checked={formValues.post_automatically || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="blog_post_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Blog Post</label>
                                <select
                                    id="blog_post_id"
                                    name="blog_post_id"
                                    value={formValues.blog_post_id || ''}
                                    onChange={handleChange}
                                    className="mt-1 p-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">None</option>
                                    {posts.map((post) => (
                                        <option key={post.id} value={post.id}>
                                            {post.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-500">Add Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isEventDetailsModalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <span className="text-gray-600 dark:text-gray-300 cursor-pointer float-right mb-2" onClick={() => setIsEventDetailsModalVisible(false)}><CircleX /></span>
                        <form onSubmit={handleUpdateEvent} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formValues.title || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formValues.description || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="post_due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Post Due Date</label>
                                <input
                                    type="datetime-local"
                                    id="post_due_date"
                                    name="post_due_date"
                                    value={formValues.post_due_date || ''}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="sm_platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Social Media Platform</label>
                                <select
                                    id="sm_platform"
                                    name="sm_platform"
                                    value={formValues.sm_platform || 'Facebook'}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Facebook">Facebook</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="TikTok">TikTok</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formValues.status || 'Draft'}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label htmlFor="post_automatically" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Auto Post?</label>
                                <input
                                    type="checkbox"
                                    id="post_automatically"
                                    name="post_automatically"
                                    checked={formValues.post_automatically || false}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="blog_post_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Blog Post</label>
                                <select
                                    id="blog_post_id"
                                    name="blog_post_id"
                                    value={formValues.blog_post_id || ''}
                                    onChange={handleChange}
                                    className="mt-1 p-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">None</option>
                                    {posts.map((post) => (
                                        <option key={post.id} value={post.id}>
                                            {post.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-500">Update Event</button>
                                <button type="button" onClick={handleDeleteEvent} className="bg-red-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-700">Delete Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isAccessTokenModalVisible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <span className="text-gray-500 dark:text-gray-300 cursor-pointer float-right" onClick={() => setIsAccessTokenModalVisible(false)}>&times;</span>
                        <AddAccessToken />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default SMMCalendar;