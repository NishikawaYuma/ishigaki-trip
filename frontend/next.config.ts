import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination: "http://localhost:8000/chat",
      },
    ];
  },
};

export default nextConfig;
