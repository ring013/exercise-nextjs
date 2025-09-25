import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/markdown";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const posts = await getAllPosts();

  // タイトル／要約／著者／タグを対象にシンプル部分一致
  const results = posts
    .filter((p) => {
      if (!q) return true; // q未指定なら全件（動作確認用）
      const haystack = [
        p.title,
        p.excerpt,
        p.author,
        ...(p.tags || []),
      ].join(" ").toLowerCase();
      return haystack.includes(q);
    })
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      author: p.author,
      tags: p.tags,
      coverImage: p.coverImage ?? null,
    }));

  return NextResponse.json({ q, count: results.length, results });
}
