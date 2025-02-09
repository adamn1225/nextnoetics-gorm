/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
        remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hvgusjfevfbhfminbmtc.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        pathname: '/**',
      },
    ],
    domains: ['localhost'],
    unoptimized: true,
  },
};

export default nextConfig;