---
title: "動的ルーティング超入門：/blog/[slug] の仕組み"
date: "2025-09-16"
author: "ギラ"
tags: ["Next.js", "Routing"]
excerpt: "generateStaticParams と params.slug の流れを最短で理解する。"
coverImage: "/images/cover-sample.jpg"
published: true
---

## なにが起きている？

- `app/blog/[slug]/page.tsx` … URL の `slug` に応じて記事を表示
- `generateStaticParams()` … 事前に静的生成する slug の一覧を Next.js に教える

```ts
// 例：1件だけ事前生成するなら
export async function generateStaticParams() {
  return [{ slug: "first-post" }];
}
