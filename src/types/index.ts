// src/types/index.ts

// 記事のメタ情報（本文以外）
export type PostMeta = {
    slug: string;
    title: string;
    date: string;
    author: string;
    tags: string[];
    excerpt: string;
    coverImage?: string;
    published: boolean;
  };
  
  // 記事（HTML本文＋読了時間を含む）
  export type Post = PostMeta & {
    contentHtml: string;
    readingMinutes: number;
  };
  
  // /api/search の返却用（UIでも再利用）
  export type SearchHit = {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    tags: string[];
    coverImage: string | null;
  };
  