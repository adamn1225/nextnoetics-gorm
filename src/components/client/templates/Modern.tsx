import React from 'react';
import Image from 'next/image';

interface TemplateProps {
    title: string;
    content: string;
    featured_image?: string;
}

const Modern: React.FC<TemplateProps> = ({ title, content, featured_image }) => {
    return (
        <div className="modern-template">
            <h1>{title}</h1>
            {featured_image && <Image src={featured_image} alt="Featured" />}
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default Modern;