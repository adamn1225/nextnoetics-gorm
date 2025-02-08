/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    domains: ['localhost'], // ✅ Allow local images
    unoptimized: true, // ✅ Disable Next.js optimization for local images
  },
};

export default nextConfig;