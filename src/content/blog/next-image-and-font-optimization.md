---
title: "Next.js 画像最適化とフォント最適化の実践"
date: "2025-09-17"
author: "ギラ"
tags: ["Next.js", "パフォーマンス", "最適化"]
excerpt: "next/image と next/font の基本と、CLS を抑える実践ポイントをまとめました。"
coverImage: "/images/cover-sample.jpg"
published: true
---

## なぜ最適化が必要？

LCP や CLS は UX と SEO に直結します。特に画像とフォントは影響が大きいです。

## 画像最適化（next/image）

- `fill` + 親に固定高さ or アスペクト比を与える
- `sizes` でレスポンシブヒントを出す
- 重要画像は `priority` を付ける

```tsx
<div className="relative" style={{height: 240}}>
  <Image src="/images/cover-sample.jpg" alt="cover" fill className="object-cover" priority />
</div>
