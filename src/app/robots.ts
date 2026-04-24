import type { MetadataRoute } from "next";

const DEFAULT_BASE_URL = "https://cyfotok.com";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || DEFAULT_BASE_URL;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/studio", "/api"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

