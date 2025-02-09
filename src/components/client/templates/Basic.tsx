import React from 'react';
import Image from 'next/image';
interface BasicProps {
    title: string;
    content: string;
    featured_image?: string;
}

const Basic: React.FC<BasicProps> = ({ title, content, featured_image }) => {
    return (
        <div>
            {featured_image && <Image src={featured_image} alt="Featured" />}
            <h1>{title}</h1>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
};

export default Basic;