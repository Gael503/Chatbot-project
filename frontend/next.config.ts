import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  poweredByHeader: false, 
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators:{ 
    position: "bottom-right"
  },
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  reactStrictMode: false
};

export default withNextIntl(nextConfig);
