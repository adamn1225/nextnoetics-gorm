import React from 'react';
import Image from 'next/image';

interface TemplateProps {
    title: string;
    content: string;
    featured_image?: string;
}

const Minimal: React.FC<TemplateProps> = ({ title, content, featured_image }) => {
    return (
        <div className="minimal-template">
            <h1>{title}</h1>
            {featured_image && <Image src={featured_image} alt="Featured" />}
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default Minimal;