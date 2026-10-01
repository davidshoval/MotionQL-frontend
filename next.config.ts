import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The desktop app and the backend's key e-mails link here.
    return [{ source: "/account/licenses", destination: "/account", permanent: false }];
  },
};

export default nextConfig;
