import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";
import SearchBox from "./SearchBox";
type MaybePromise<T> = T | Promise<T>;
type BlogIndexPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

export const revalidate = 3600;


export default async function BlogPage({ searchParams }: BlogIndexPageProps) {
  const sp = await searchParams;
  const all = await getAllPosts();

  // --- 簡易ページネーション ---
  const page = Math.max(1, Number(sp?.page ?? 1));
  const perPage = 3;
  const start = (page - 1) * perPage;
  const posts = all.slice(start, start + perPage);
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">ブログ記事</h1>

      {/* 検索ボックス */}
      <SearchBox />

      {posts.length === 0 ? (
        <p className="!text-white/90">まだ記事がありません。</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.slug} className="border border-zinc-800 rounded-lg p-4 text-white">
              {/* カバー画像（SVGもOKにしたいなら背景方式に切替可） */}
              {p.coverImage && (
                <div className="relative w-full overflow-hidden rounded mb-3" style={{ height: 160 }}>
                  <Image
                    src={p.coverImage}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 960px) 100vw, 960px"
                  />
                </div>
              )}

              <Link href={`/blog/${p.slug}`} className="text-lg font-semibold hover:opacity-90">
                {p.title}
              </Link>

              <div className="text-sm !text-white mt-0.5">
                {formatJa(p.date)} ・ {p.author}
              </div>

              <p className="text-sm mt-1 !text-white/90">{p.excerpt}</p>

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
      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between">
          <Link
            href={`/blog?page=${Math.max(1, page - 1)}`}
            className={`px-3 py-2 rounded border border-zinc-700 ${
              page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-zinc-800"
            }`}
          >
            ← 前のページ
          </Link>
          <span className="text-white/80 text-sm">
            {page} / {totalPages}
          </span>
          <Link
            href={`/blog?page=${Math.min(totalPages, page + 1)}`}
            className={`px-3 py-2 rounded border border-zinc-700 ${
              page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-zinc-800"
            }`}
          >
            次のページ →
          </Link>
        </nav>
      )}
    </section>
  );
}
