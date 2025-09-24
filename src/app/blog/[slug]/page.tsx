import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import TableOfContents from "@/components/blog/TableOfContents";

export const revalidate = 3600;

// 課題リポジトリの型方針に合わせる（params/searchParams は Promise）
type BlogPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

// 静的生成のためのパス
export function generateStaticParams(): { slug: string }[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

// 記事ごとのSEOメタ
export async function generateMetadata(
  { params }: BlogPageProps
): Promise<Metadata> {
  const { slug } = await params; // ← ここがポイント
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

export default async function PostPage({ params }: BlogPageProps) {
  const { slug } = await params; // ← ここがポイント
  const post = await getPostBySlug(slug);
  if (!post || post.published === false) notFound();

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-2 text-white">{post.title}</h1>
      <p className="text-white/80 mb-4">
        {post.date} ・ {post.author} ・ {post.tags.join(" / ")}
      </p>

      {post.coverImage && (
        <div className="relative w-full h-64 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover rounded"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_260px] gap-8">
        <article
          id="post-article"
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        <aside className="hidden lg:block">
          <TableOfContents target="#post-article" />
        </aside>
      </div>

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
