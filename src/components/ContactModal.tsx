import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

interface ContactModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, closeModal }) => {
    const [formData, setFormData] = useState({
        websiteUrl: '',
        platformType: '',
        hostingProvider: '',
        hostingProviderOther: '',
        setupEmail: '',
        platformTypeOther: '',
        preferredTemplates: [] as string[], // Set initial state to string[]
        customTemplate: '',
        customDomain: false,
        additionalNotes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { options } = e.target;
        const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
        setFormData((prevData) => ({
            ...prevData,
            preferredTemplates: selectedOptions,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/.netlify/functions/sendEmail', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                alert('Request sent successfully!');
                closeModal();
            } else {
                alert('Failed to send request.');
            }
        } catch (error) {
            console.error('Error sending request:', error);
            alert('An error occurred while sending the request.');
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black opacity-30" />
                    </Transition.Child>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Contact Us to Enable CMS
                            </Dialog.Title>
                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                <div>
                                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
                                        Website URL
                                    </label>
                                    <input
                                        type="url"
                                        id="websiteUrl"
                                        name="websiteUrl"
                                        value={formData.websiteUrl}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="platformType" className="block text-sm font-medium text-gray-700">
                                        Platform Type
                                    </label>
                                    <select
                                        id="platformType"
                                        name="platformType"
                                        value={formData.platformType}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        required
                                    >
                                        <option value="">Select a platform</option>
                                        <option value="Next.js">Next.js</option>
                                        <option value="Astro">Astro</option>
                                        <option value="WordPress">WordPress</option>
                                        <option value="HTML/CSS/JS">HTML/CSS/JS</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formData.platformType === 'Other' && (
                                        <input
                                            type="text"
                                            name="platformTypeOther"
                                            value={formData.platformTypeOther || ''}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            placeholder="Please specify"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="hostingProvider" className="block text-sm font-medium text-gray-700">
                                        Hosting Provider
                                    </label>
                                    <select
                                        id="hostingProvider"
                                        name="hostingProvider"
                                        value={formData.hostingProvider}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        required
                                    >
                                        <option value="">Select a hosting provider</option>
                                        <option value="Netlify">Netlify</option>
                                        <option value="Vercel">Vercel</option>
                                        <option value="DigitalOcean">DigitalOcean</option>
                                        <option value="AWS">AWS</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {formData.hostingProvider === 'Other' && (
                                        <input
                                            type="text"
                                            name="hostingProviderOther"
                                            value={formData.hostingProviderOther || ''}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            placeholder="Please specify"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="setupEmail" className="block text-sm font-medium text-gray-700">
                                        Which Email Should we send set up instructions to?
                                    </label>
                                    <input
                                        type="email"
                                        id="setupEmail"
                                        name="setupEmail"
                                        value={formData.setupEmail}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="preferredTemplates" className="block text-sm font-medium text-gray-700">
                                        Preferred CMS Templates
                                    </label>
                                    <select
                                        id="preferredTemplates"
                                        name="preferredTemplates"
                                        multiple
                                        value={formData.preferredTemplates}
                                        onChange={handleMultiSelectChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        required
                                    >
                                        <option value="Basic">Basic</option>
                                        <option value="Minimal">Minimal</option>
                                        <option value="Modern">Modern</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                    {formData.preferredTemplates.includes('Custom') && (
                                        <input
                                            type="text"
                                            name="customTemplate"
                                            value={formData.customTemplate || ''}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                            placeholder="Please specify"
                                        />
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="customDomain" className="block text-sm font-medium text-gray-700">
                                        Custom Domain Setup Needed?
                                    </label>
                                    <div className="mt-1 flex items-center">
                                        <input
                                            type="checkbox"
                                            id="customDomain"
                                            name="customDomain"
                                            checked={formData.customDomain}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                        <label htmlFor="customDomain" className="ml-2 block text-sm text-gray-900">
                                            Yes
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700">
                                        Additional Notes
                                    </label>
                                    <textarea
                                        id="additionalNotes"
                                        name="additionalNotes"
                                        value={formData.additionalNotes}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
                                    >
                                        Send Request
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ContactModal;