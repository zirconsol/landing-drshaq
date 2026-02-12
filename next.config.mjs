function parseRemotePattern(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(":", ""),
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      pathname: "/**",
    };
  } catch {
    return null;
  }
}

const remoteCandidates = [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  process.env.API_BASE_URL,
  process.env.CATALOG_API_BASE_URL,
  process.env.NEXT_PUBLIC_ASSET_BASE_URL,
  process.env.ASSET_PUBLIC_BASE_URL,
];

const envRemotePatterns = remoteCandidates
  .map(parseRemotePattern)
  .filter(Boolean);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", pathname: "/**" },
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      {
        protocol: "https",
        hostname: "hqzbikcwbmfxikcmdbfz.supabase.co",
        pathname: "/**",
      },
      { protocol: "https", hostname: "**.supabase.co", pathname: "/**" },
      ...envRemotePatterns,
    ],
  },
};

export default nextConfig;
