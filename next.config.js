/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: {
    domains: ["your-cloudflare-domain.com"],
  },
};

module.exports = nextConfig;
