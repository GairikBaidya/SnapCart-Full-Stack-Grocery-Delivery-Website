import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        hostname:"lh3.googleusercontent.com"
      },
      {
        hostname:"images.unsplash.com"
      },{
        hostname:"plus.unsplash.com"
      }
      ,{
        hostname:"res.cloudinary.com"
      }
    ]
  },
  
};

export default nextConfig;
