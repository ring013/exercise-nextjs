import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/markdown";

// 本番では環境変数から受け取るのがベター
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const tags = await getAllTags();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/blog`,            lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${SITE_URL}/about`,           lastModified: new Date(), changeFrequency: "yearly",  priority: 0.4 },
    { url: `${SITE_URL}/rss.xml`,         lastModified: new Date(), changeFrequency: "daily",   priority: 0.3 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const tagPages: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${SITE_URL}/blog/tag/${encodeURIComponent(t)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...tagPages];
}
