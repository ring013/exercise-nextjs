import { getAllPosts } from "@/lib/markdown";

export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPosts();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const urls = [
    `${base}/`,
    `${base}/blog`,
    `${base}/about`,
    ...posts.map((p) => `${base}/blog/${p.slug}`),
  ];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map((u) => `<url><loc>${u}</loc></url>`).join("") +
    `</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=UTF-8" },
  });
}
