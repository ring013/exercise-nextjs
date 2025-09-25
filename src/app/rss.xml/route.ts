// src/app/rss.xml/route.ts
import { getAllPosts } from "@/lib/markdown";

// 1時間ごとに再生成（ISR）
export const revalidate = 3600;

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(request: Request) {
  const posts = await getAllPosts();

  // 本番URLがあればそれを、無ければヘッダから推定（ローカル対応）
  const proto =
    process.env.NEXT_PUBLIC_SITE_URL
      ? null
      : request.headers.get("x-forwarded-proto") ?? "http";
  const host =
    process.env.NEXT_PUBLIC_SITE_URL
      ? null
      : request.headers.get("x-forwarded-host") ??
        request.headers.get("host") ??
        "localhost:3000";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;

  const items = posts
    .map((p) => {
      const link = `${siteUrl}/blog/${p.slug}`;
      return `
        <item>
          <title>${escapeXml(p.title)}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <pubDate>${new Date(p.date).toUTCString()}</pubDate>
          <description>${escapeXml(p.excerpt || "")}</description>
        </item>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml("Next Blog")}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml("Next.js で作った技術ブログのRSSフィード")}</description>
    <language>ja-JP</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
