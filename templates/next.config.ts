import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    typedRoutes: true,
    compiler: {removeConsole: process.env.NODE_ENV === "production"},
    logging: {fetches: {fullUrl: true}},
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: '**',
        }]
    }
};

export default nextConfig;
