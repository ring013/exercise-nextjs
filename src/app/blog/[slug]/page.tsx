import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import TableOfContents from "@/components/blog/TableOfContents";

export const revalidate = 3600;

// 静的生成のためのパス
export function generateStaticParams(): { slug: string }[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

// 記事ごとのSEOメタ
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  if (!post || post.published === false) return {};

  const title = post.title;
  const description = post.excerpt || `${post.title} — ${post.author}`;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const url = `${siteUrl}/blog/${slug}`;
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);
  if (!post || post.published === false) notFound();

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-2 text-white">{post.title}</h1>
      <p className="text-white/80 mb-4">
        {post.date} ・ {post.author} ・ {post.tags.join(" / ")}
      </p>

      {/* カバー画像（任意） */}
      {post.coverImage && (
        <div className="relative w-full h-64 mb-6">
          {/* 外部画像対応を簡単にするため、ここは <img> を使用 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
      )}

      {/* 本文＋目次の2カラム（lg以上でサイドに目次） */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-8">
        {/* 本文 */}
        <article
          id="post-article"
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* 目次 */}
        <aside className="hidden lg:block">
          <TableOfContents target="#post-article" />
        </aside>
      </div>

      {/* 下部ナビ */}
      <div className="mt-10">
        <Link
          href="/blog"
          className="rounded border border-white/15 px-4 py-2 hover:bg-white/5"
        >
          記事一覧へ
        </Link>
      </div>
    </section>
  );
}
