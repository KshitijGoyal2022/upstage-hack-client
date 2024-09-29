/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['lh3.googleusercontent.com', 'www.gstatic.com', 'serpapi.com', 'lh5.googleusercontent.com', 'lh6.googleusercontent.com', 'lh4.googleusercontent.com', 'lh3.googleusercontent.com', 'lh2.googleusercontent.com', 'www.google.com', 'encrypted-tbn0.gstatic.com', 'resx.octorate.com', 'lh3.googleusercontent.com', 'lh2.googleusercontent.com', 'lh7.googleusercontent.com'], // Add any other domains you need here
    },
    typescript: {ignoreBuildErrors: true},
    eslint: {
      ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  };
  
  export default nextConfig;
  