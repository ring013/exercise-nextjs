// src/app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/markdown";
import { formatJa } from "@/lib/utils";
import Reveal from "@/components/Reveal";

export const revalidate = 3600;

export default async function HomePage() {
  const posts = await getAllPosts();
  const latest = posts.slice(0, 3); // 最新3件

  return (
    <section className="max-w-[1000px] mx-auto px-5 md:px-6 py-10 md:py-14 space-y-16 md:space-y-20">
      {/* Hero */}
      <Reveal>
        <div className="rounded-3xl border border-zinc-800/70 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 md:p-12 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Gira&apos;sBlog
          </h1>
          <p className="mt-4 text-zinc-300 leading-relaxed max-w-[48rem]">
            Next.js・Markdown・App Router・検索・RSS・OGP の
            “学びを形にする” コンパクトな技術ブログ。
          </p>
        </div>
      </Reveal>

      {/* 最新の記事 */}
      <div className="space-y-6">
        <Reveal>
          <h2 className="text-2xl font-bold">最新の記事</h2>
        </Reveal>

        {latest.length === 0 ? (
          <Reveal>
            <p className="text-zinc-400">まだ記事がありません。</p>
          </Reveal>
        ) : (
          <ul className="grid gap-6 md:gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <li className="rounded-2xl border border-zinc-800 overflow-hidden hover:border-zinc-700 transition-colors bg-zinc-950/40">
                  <Link href={`/blog/${p.slug}`} className="block group">
                    {/* サムネイル */}
                    {p.coverImage ? (
                      <div className="relative h-44 md:h-48">
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 320px"
                          priority={false}
                        />
                      </div>
                    ) : (
                      <div className="h-44 md:h-48 bg-zinc-900" />
                    )}

                    {/* 本文 */}
                    <div className="p-5">
                      <h3 className="font-semibold group-hover:opacity-90">
                        {p.title}
                      </h3>
                      <div className="mt-1.5 text-xs text-zinc-400">
                        {formatJa(p.date)} ・ {p.author}
                      </div>
                      {p.excerpt && (
                        <p className="mt-3 text-sm text-zinc-300 line-clamp-2">
                          {p.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        )}

        {/* 一覧ボタン（記事の下） */}
        <Reveal>
          <div className="pt-2">
            <Link
              href="/blog"
              className="inline-block rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              記事一覧へ
            </Link>
          </div>
        </Reveal>
      </div>

      {/* このブログについて */}
      <Reveal>
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-7 md:p-8 shadow-md">
          <h2 className="text-2xl font-bold mb-3">このブログについて</h2>
          <p className="text-zinc-300 leading-relaxed max-w-[52rem]">
            Gira&apos;sBlog は Next.js × Markdown で学びを記録する技術ブログです。
            Web開発の実験や知見をコンパクトに共有します。
          </p>
          <div className="mt-4">
            <Link
              href="/about"
              className="text-indigo-400 underline underline-offset-4 hover:opacity-80"
            >
              さらに詳しく
            </Link>
          </div>
        </section>
      </Reveal>
    </section>
  );
}
