// src/lib/posts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "src/content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt?: string;
  author?: string;
  coverImage?: string;
  published?: boolean;
};

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getAllPosts(): PostMeta[] {
  const slugs = getAllSlugs();
  const posts = slugs.map((slug) => {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const file = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(file);

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ?? "",
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: data.excerpt ?? "",
      author: data.author ?? "",
      coverImage: data.coverImage ?? "",
      published: data.published ?? true,
    } as PostMeta;
  });

  // 非公開は除外し、日付降順に
  return posts
    .filter((p) => p.published !== false)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    contentHtml,
    title: data.title ?? slug,
    date: data.date ?? "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    excerpt: data.excerpt ?? "",
    author: data.author ?? "",
    coverImage: data.coverImage ?? "",
    published: data.published ?? true,
  };
}

export function getPostsByTag(tag: string): PostMeta[] {
  const all = getAllPosts();
  return all.filter((p) => p.tags?.includes(tag));
}
