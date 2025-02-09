import Head from 'next/head';

interface CanonicalURLProps {
    url: string;
}

const CanonicalURL = ({ url }: CanonicalURLProps) => (
    <Head>
        <link rel="canonical" href={url} />
    </Head>
);

export default CanonicalURL;