// src/app/blog/tag/[tag]/page.tsx
import Link from "next/link";
import Image from "next/image"; // ← 追加
import { getPostsByTag } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";
type TagPageProps = {
  params: Promise<{ tag: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 3600;

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = await getPostsByTag(decoded);

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-4">#{decoded} の記事</h1>

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
                {formatJa(p.date)} ・ {p.author}
              </div>

              {p.excerpt && <p className="text-sm mt-1 text-white/90">{p.excerpt}</p>}

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
    </section>
  );
}
