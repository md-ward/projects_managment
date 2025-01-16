/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000", // Adjust this to the port your local server uses
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
 