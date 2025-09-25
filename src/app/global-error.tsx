// src/app/global-error.tsx
"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // エラーはコンソールに出すだけ（画面には出さない）
  console.error(error);

  return (
    <html lang="ja">
      <body className="min-h-screen bg-zinc-950 text-zinc-50">
        <main className="max-w-[720px] mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-extrabold mb-3">サーバーエラーが発生しました</h1>
          <p className="text-zinc-300">
            一時的な問題の可能性があります。操作をやり直すか、トップへお戻りください。
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={reset}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:opacity-90"
            >
              もう一度試す
            </button>
            <Link
              href="/"
              className="rounded border border-white/15 px-4 py-2 hover:bg-white/5"
            >
              Homeへ
            </Link>
          </div>

          <p className="mt-6 text-xs text-zinc-500">Gira&apos;sBlog</p>
        </main>
      </body>
    </html>
  );
}
