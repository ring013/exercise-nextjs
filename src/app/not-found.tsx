import Link from "next/link";

export default function NotFound() {
  return (
    <section className="max-w-[960px] mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">ページが見つかりません</h1>
      <p className="text-white/80">
        URLをご確認ください。トップへ戻るか、ブログ一覧をご覧ください。
      </p>

      <div className="mt-4 flex gap-3">
        <Link
          href="/"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:opacity-90"
        >
          Home
        </Link>
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
