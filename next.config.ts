import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/products",
        destination: "/admin/products/products",
        permanent: false,
      },
      {
        source: "/admin/purchases",
        destination: "/admin/purchases/purchases",
        permanent: false,
      },
      {
        source: "/admin/sales",
        destination: "/admin/sales/sales",
        permanent: false,
      },
      {
        source: "/admin/expenses",
        destination: "/admin/expenses/expenses",
        permanent: false,
      },
      {
        source: "/admin/withdrawals",
        destination: "/admin/withdrawals/withdrawals",
        permanent: false,
      },
      {
        source: "/admin/deposit",
        destination: "/admin/deposit/deposit",
        permanent: false,
      },
      {
        source: "/admin/directors",
        destination: "/admin/directors/directors",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
