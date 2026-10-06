import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The desktop app and the backend's key e-mails link here.
    return [
      { source: "/account/licenses", destination: "/account", permanent: false },
      // Invite links (refer a friend). The sign-up form keeps the code.
      { source: "/r/:code", destination: "/register?ref=:code", permanent: false },
    ];
  },
};

export default nextConfig;
