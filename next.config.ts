import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'hifiveai.co',
          },
        ],
        destination: 'https://www.hifiveai.co/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
