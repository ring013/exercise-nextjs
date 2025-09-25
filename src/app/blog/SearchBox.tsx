"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Hit = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  coverImage: string | null;
};

export default function SearchBox() {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);            // Enterで出す検索結果
  const [suggests, setSuggests] = useState<Hit[]>([]);    // 入力中のサジェスト（上位5件）
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);                // サジェストの開閉
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 入力中サジェスト（0.3秒デバウンス）
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!q || q.trim().length < 2) {
      setSuggests([]);
      setOpen(false);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`);
        const data = await res.json();
        const list = Array.isArray(data.results) ? data.results.slice(0, 5) : [];
        setSuggests(list);
        setOpen(list.length > 0);
      } catch {
        // サジェスト失敗は致命ではないので黙って閉じる
        setSuggests([]);
        setOpen(false);
      }
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [q]);

  // 検索フォームSubmit（Enter押下 or ボタン）
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setError(null);
    setOpen(false);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setHits(Array.isArray(data.results) ? data.results : []);
    } catch {
      setError("検索に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  // フォーカス外れたらサジェストを閉じる（クリック操作を邪魔しないように少し遅らせる）
  function closeSuggestWithDelay() {
    setTimeout(() => setOpen(false), 150);
  }

  return (
    <div className="mb-6 relative">
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => suggests.length > 0 && setOpen(true)}
          onBlur={closeSuggestWithDelay}
          placeholder="キーワードを入力（例: Next.js, Routing など）"
          className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white placeholder:text-zinc-400"
        />
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:opacity-90"
        >
          検索
        </button>
      </form>

      {/* 入力中サジェスト（ドロップダウン） */}
      {open && suggests.length > 0 && (
        <ul
          className="absolute z-10 mt-1 w-full rounded border border-zinc-700 bg-zinc-900/95 backdrop-blur p-2"
          onMouseDown={(e) => e.preventDefault()} // フォーカス喪失で閉じないように
        >
          {suggests.map((s) => (
            <li key={s.slug} className="rounded hover:bg-zinc-800">
              <Link
                href={`/blog/${s.slug}`}
                className="block px-3 py-2"
                onClick={() => setOpen(false)}
              >
                <div className="text-white font-medium">{s.title}</div>
                <div className="text-xs text-white/70">
                  {s.author} ・ {new Date(s.date).toLocaleDateString("ja-JP")}
                </div>
                {s.tags?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {s.tags.slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="mt-2 text-white/80">検索中…</p>}
      {error && <p className="mt-2 text-red-400">{error}</p>}

      {/* Enterでの通常検索結果 */}
      {hits.length > 0 && (
        <ul className="mt-4 space-y-3">
          {hits.map((h) => (
            <li key={h.slug} className="rounded border border-zinc-700 p-3">
              <Link
                href={`/blog/${h.slug}`}
                className="font-semibold text-white hover:opacity-90"
              >
                {h.title}
              </Link>
              <div className="text-xs text-white/80 mt-0.5">
                {h.author} ・ {new Date(h.date).toLocaleDateString("ja-JP")}
              </div>
              {h.excerpt && (
                <p className="mt-1 text-sm text-white/90">{h.excerpt}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {h.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
