import React from 'react';
import Basic from './templates/Basic';
import Minimal from './templates/Minimal';
import Modern from './templates/Modern';

interface TemplateLoaderProps {
    title: string;
    content: string;
    content_html?: string;
    template: 'basic' | 'minimal' | 'modern';
    featured_image?: string;
}

const templates: Record<TemplateLoaderProps['template'], React.FC<any>> = {
    basic: Basic,
    minimal: Minimal,
    modern: Modern,
};

const TemplateLoader: React.FC<TemplateLoaderProps> = ({ title, content, content_html, template, featured_image }) => {
    const TemplateComponent = templates[template] || Basic;

    return (
        <div className="template-loader">
            <TemplateComponent
                title={title}
                content={content_html || content}
                featured_image={featured_image}
            />
        </div>
    );
};

export default TemplateLoader;