import React from 'react';
import TemplateLoader from './TemplateLoader';

interface PreviewProps {
    title: string;
    content: string;
    content_html?: string;
    template: 'basic' | 'minimal' | 'modern';
    featured_image?: string;
}

const CmsPreview: React.FC<PreviewProps> = ({ title, content, content_html, template, featured_image }) => {
    return (
        <div className="preview-container text-zinc-900">
            <TemplateLoader title={title} content={content} content_html={content_html} template={template} featured_image={featured_image} />
        </div>
    );
};

export default CmsPreview;