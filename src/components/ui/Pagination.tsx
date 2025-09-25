// src/components/ui/Pagination.tsx
"use client";

import Link from "next/link";

type Props = {
  total: number;        // 全記事数
  perPage: number;      // 1ページあたり
  currentPage: number;  // 現在ページ(1始まり)
  basePath: string;     // 例: "/blog"
};

export default function Pagination({ total, perPage, currentPage, basePath }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  if (totalPages <= 1) return null;

  const pageLink = (p: number) => `${basePath}?page=${p}`;

  return (
    <nav className="mt-6 flex items-center justify-center gap-2 text-sm">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={pageLink(currentPage - 1)}
          className="px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-800 text-white"
        >
          ‹ 前へ
        </Link>
      ) : (
        <span className="px-3 py-1 rounded border border-zinc-800 text-zinc-500 cursor-not-allowed">
          ‹ 前へ
        </span>
      )}

      {/* 数字（小規模前提なので全部表示） */}
      <ul className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <li key={p}>
            {p === currentPage ? (
              <span className="px-3 py-1 rounded border border-blue-500 bg-blue-600 text-white">
                {p}
              </span>
            ) : (
              <Link
                href={pageLink(p)}
                className="px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-800 text-white"
              >
                {p}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageLink(currentPage + 1)}
          className="px-3 py-1 rounded border border-zinc-700 hover:bg-zinc-800 text-white"
        >
          次へ ›
        </Link>
      ) : (
        <span className="px-3 py-1 rounded border border-zinc-800 text-zinc-500 cursor-not-allowed">
          次へ ›
        </span>
      )}
    </nav>
  );
}
