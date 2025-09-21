import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getAllSlugs, getPostBySlug } from "@/lib/markdown";
import { formatJa, readingTimeJa } from "@/lib/utils";
import TableOfContents from "@/components/blog/TableOfContents";
type MaybePromise<T> = T | Promise<T>;
type BlogPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};


export const revalidate = 3600;

// 静的生成するパス
export function generateStaticParams(): { slug: string }[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

// 記事ごとの SEO メタデータ
export async function generateMetadata(
  { params }: BlogPageProps
): Promise<Metadata> { 
  const { slug } = await params;
  const post = await getPostBySlug(slug); 
  if (!post || !post.published) return {};

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
  const url = `${siteUrl}/blog/${post.slug}`;
  const title = post.title;
  const description = post.excerpt || `${post.title} – ${post.author}`;
  const ogImage = `${siteUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
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
export default async function PostPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const timeLabel = readingTimeJa(post.contentHtml);

  return (
    <section className="max-w-[1100px] mx-auto px-4 md:px-6 py-8">
      {/* タイトルブロック */}
      {post.coverImage && (
        <div className="relative w-full overflow-hidden rounded-xl mb-6" style={{ height: 320 }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1100px"
            priority
          />
        </div>
      )}

      <h1 className="text-4xl font-extrabold mb-2">{post.title}</h1>
      <p className="text-white/80 mb-4">
        {formatJa(post.date)} ・ {post.author} ・ {timeLabel}
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {post.tags.map((t) => (
          <Link
            key={t}
            href={`/blog/tag/${encodeURIComponent(t)}`}
            className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800"
          >
            #{t}
          </Link>
        ))}
      </div>

      {/* 本文＋目次：lg以上で2カラム */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-8">
        {/* 本文 */}
        <article
          id="post-article"
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* 目次（右カラムに固定） */}
        <TableOfContents target="#post-article" />
      </div>

      {/* 下部ナビ */}
      <div className="mt-10 flex gap-3">
        <Link
          href="/blog"
          className="rounded border border-white/15 px-4 py-2 hover:bg-white/5"
        >
          記事一覧へ
        </Link>
        <Link
          href="/"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:opacity-90"
        >
          このサイトについて
        </Link>
      </div>
    </section>
  );
}
