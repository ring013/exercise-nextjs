---
title: "SSG と ISR を5行で理解する"
date: "2025-09-16"
author: "ギラ"
tags: ["Next.js", "SSG", "ISR"]
excerpt: "静的生成（SSG）と増分再生成（ISR）の違いを最小のコードで整理。"
coverImage: "/images/cover-sample.jpg"
published: true
---

## まず結論

- **SSG**: ビルド時に静的HTMLを作る。配信が速い。
- **ISR**: 公開後も一定間隔で静的ページを作り直せる（自動更新）。

## 使い方（超最小）

```ts
// ページファイル内に置くだけ
export const revalidate = 3600; // ← 1時間ごとに再生成（= ISR）
