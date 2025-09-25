// src/app/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600;

type BlogIndexPageProps = {
  searchParams?: Promise<{ q?: string; page?: string }>;
};

export default async function BlogPage({ searchParams }: BlogIndexPageProps) {
  const sp = await searchParams;
  const q = (sp?.q ?? "").toString().trim();
  const page = Math.max(1, Number(sp?.page ?? 1));
  const perPage = 5;

  const all = await getAllPosts();

  // タイトル/抜粋/タグを対象に簡易検索
  const filtered = q
    ? all.filter((p) => {
        const hay = [
          p.title,
          p.excerpt ?? "",
          ...(p.tags ?? []),
        ].join(" ").toLowerCase();
        return hay.includes(q.toLowerCase());
      })
    : all;

  const start = (page - 1) * perPage;
  const posts = filtered.slice(start, start + perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  const mkHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const query = params.toString();
    return query ? `/blog?${query}` : `/blog`;
  };

  return (
    <section className="max-w-[960px] mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-extrabold text-white">ブログ記事</h1>

      {/* 検索フォーム（GET） */}
      <form method="get" className="flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="タイトル・タグで検索"
          className="flex-1 rounded border border-white/15 bg-transparent px-3 py-2 text-white placeholder-white/50"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:opacity-90"
        >
          検索
        </button>
      </form>

      {posts.length === 0 ? (
        <p className="text-white/90">該当記事がありません。</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="border border-zinc-800 rounded-lg p-4">
              {p.coverImage && (
                <div className="relative w-full h-40 mb-3">
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 960px"
                  />
                </div>
              )}

              <Link
                href={`/blog/${p.slug}`}
                className="text-lg font-semibold hover:opacity-90"
              >
                {p.title}
              </Link>

              <div className="text-sm text-white/80 mt-0.5">
                {p.date} ・ {p.author}
              </div>

              {p.excerpt && (
                <p className="text-sm mt-1 text-white/90">{p.excerpt}</p>
              )}

              <div className="mt-2 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog/tag/${encodeURIComponent(t)}`}
                    className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ページネーション */}
      <div className="flex items-center justify-between pt-2">
        <Link
          aria-disabled={page <= 1}
          href={page <= 1 ? mkHref(1) : mkHref(page - 1)}
          className={`rounded border border-white/15 px-3 py-1 ${
            page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-white/5"
          }`}
        >
          ← 前へ
        </Link>

        <div className="text-sm text-white/70">
          {page} / {totalPages}
        </div>

        <Link
          aria-disabled={page >= totalPages}
          href={page >= totalPages ? mkHref(totalPages) : mkHref(page + 1)}
          className={`rounded border border-white/15 px-3 py-1 ${
            page >= totalPages
              ? "pointer-events-none opacity-40"
              : "hover:bg-white/5"
          }`}
        >
          次へ →
        </Link>
      </div>
    </section>
  );
}
