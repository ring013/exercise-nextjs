import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 3600;

export default async function BlogPage() {
  const all = await getAllPosts(); // ここは同期関数だが、将来API化するときに備えasyncでOK

  return (
    <section className="max-w-[960px] mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-white">ブログ記事</h1>

      {all.length === 0 ? (
        <p className="text-white/90">まだ記事がありません。</p>
      ) : (
        <ul className="space-y-4">
          {all.map((p) => (
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
    </section>
  );
}
