import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {qualities: [75, 80]}
};

export default createNextIntlPlugin()(nextConfig);
