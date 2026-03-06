import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { BLOGS_QUERY } from "@/sanity/lib/queries";

type BlogForSitemap = {
  _id: string;
  _createdAt: string;
};

const DEFAULT_BASE_URL = "https://cyfotok.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || DEFAULT_BASE_URL;

  let blogs: BlogForSitemap[] = [];

  try {
    blogs = await client.fetch<BlogForSitemap[]>(BLOGS_QUERY);
  } catch {
    // If Sanity is unavailable, still return static routes
    blogs = [];
  }

  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs/all`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/internships`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((post) => ({
    url: `${baseUrl}/blog/${post._id}`,
    lastModified: post._createdAt || now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}

