/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },

      // Backend uploaded images
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
      },

      // Backend uploaded images in deployed environments. next/image refuses
      // any host not listed here, so the deployed backend must be allowed too.
      ...(process.env.NEXT_PUBLIC_API_URL
        ? [
            {
              protocol: new URL(process.env.NEXT_PUBLIC_API_URL).protocol.replace(":", ""),
              hostname: new URL(process.env.NEXT_PUBLIC_API_URL).hostname,
            },
          ]
        : []),
    ],
  },
};

module.exports = nextConfig;