/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.scdn.co",
      "mosaic.scdn.co",
      "daily-mix.scdn.co",
      "image-cdn-ak.spotifycdn.com",
      "images-ak.spotifycdn.com",
      "wrapped-images.spotifycdn.com",
    ],
  },
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:5328/api/:path*"
            : "/api/",
      },
    ];
  },
};

module.exports = nextConfig;
