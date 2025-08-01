/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['erpsamuiaksorn.com'],
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate'
                    }
                ]
            }
        ]
    }
};

export default nextConfig;