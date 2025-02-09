'use client';
import React, { useState } from "react";
import { motion } from "framer-motion";
import { slideInFromTop } from "../motionConfig";
import { supabase } from "@lib/supabaseClient"; // Import Supabase client

interface CallToActionSectionProps {
  title: string;
  subtitle: string;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ title, subtitle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleModalToggle = () => {
    setIsModalOpen((prev) => !prev);
    setSuccess(false);
    setError("");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { data, error } = await supabase.from("clients").insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
      ]);

      if (error) throw error;

      // Send email notification
      const emailText = `
        New contact form submission:
        Name: ${formData.name}
        Email: ${formData.email}
        Message: ${formData.message}
      `;

      const functionUrl = process.env.NODE_ENV === 'development'
        ? 'http://localhost:8888/.netlify/functions/sendEmail'
        : '/.netlify/functions/sendEmail';

      await fetch(functionUrl, {
        method: 'POST',
        body: JSON.stringify({
          to: 'noah@noetics.io',
          subject: 'New Contact Form Submission',
          text: emailText,
          userEmail: formData.email,
        }),
      });

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      id="contact"
      className="bg-zinc-950 dark:bg-zinc-900 text-white pb-12"
      {...slideInFromTop}
    >
      <div className="container bg-zinc-950 mx-auto px-4 py-8 text-center">
        <h2 className="text-4xl font-bold mb-6">
          {title}
        </h2>
        <p className="text-lg mb-6">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() =>
              (window.location.href = "mailto:anoah1225@gmail.com")
            }
            className="opt-btn text-base md:text-lg"
          >
            Email Us
          </button>
          <button
            onClick={() => (window.location.href = "tel:+1234567890")}
            className="opt-btn text-base md:text-lg"
          >
            Call Us
          </button>
          <button
            onClick={handleModalToggle}
            className="opt-btn text-base md:text-lg"
          >
            Fill Out a Form
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 dark:bg-zinc-950/80 dark:text-white bg-opacity-50 flex justify-center items-center">
          <div className="bg-white text-gray-900 rounded-lg shadow-xl w-11/12 max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Contact Us</h2>
              <button
                onClick={handleModalToggle}
                className="text-gray-500 hover:text-primary font-bold text-lg"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-red-500 sm:text-sm"
                  placeholder="Your Name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md"
              >
                {loading ? "Submitting..." : "Send Message"}
              </button>

              {success && (
                <p className="text-green-500 mt-2">
                  Message sent successfully!
                </p>
              )}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default CallToActionSection;