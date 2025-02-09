import React from 'react';
import Image from 'next/image';

interface BasicProps {
    title: string;
    content: string;
    featured_image?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const Basic: React.FC<BasicProps> = ({ title, content, featured_image }) => {
    return (
        <div>
            {featured_image && (
                <Image
                    src={`${API_URL}${featured_image}`}  // ✅ Use full URL
                    alt="Featured"
                    width={800}
                    height={500}
                    layout="responsive"
                />
            )}
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default Basic;
