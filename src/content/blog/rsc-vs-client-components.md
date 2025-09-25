---
title: "RSC と Client Components の使い分け超入門"
date: "2025-09-16"
author: "ギラ"
tags: ["Next.js", "RSC", "React"]
excerpt: "何をサーバーで、何をクライアントで動かす？超ミニ解説。"
published: true
---

## ポイントだけ

- **RSC（Server Components）**: データ取得や重い処理をサーバー側で。`"use client"` は不要。
- **Client Components**: ユーザー操作（state, event）が必要なUI。ファイル先頭に `"use client"` を付ける。

```tsx
// Client Component の最小例
"use client";
import { useState } from "react";

export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>count: {n}</button>;
}
