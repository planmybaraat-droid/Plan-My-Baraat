/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];
    const privateHeaders = [
      ...securityHeaders,
      { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
      { key: "Cache-Control", value: "private, no-store, max-age=0" },
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/crm/:path*", headers: privateHeaders },
      { source: "/workspace/:path*", headers: privateHeaders },
      { source: "/admin/:path*", headers: privateHeaders },
    ];
  },
  async redirects() {
    return [
      {
        source: "/icons/icon.svg",
        destination: "/icon-mark-180.png",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-**",
      },
    ],
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/icons/icon.svg",
        destination: "/icon-mark-180.png",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-**",
      },
    ],
  },
};

export default nextConfig;
