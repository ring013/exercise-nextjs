---
title: "TypeScript 実践 Tips 10選"
date: "2025-09-17"
author: "ギラ"
tags: ["TypeScript", "型安全", "学習メモ"]
excerpt: "ユニオン・ジェネリクス・型ガードなど、現場でよく使う小技を短くまとめました。"
coverImage: "/images/cover-sample.jpg"
published: true
---

## 1. 状態はユニオン型で表す
```ts
type Status = "loading" | "error" | "success";
```
取りうる状態が明確になり、漏れを減らせます。

## 2. 型エイリアスで再利用しやすく
```ts
type UserId = string;
type Price = number;
```
意味のある名前を付けるだけで読みやすさUP。

## 3. ジェネリクスで結果型を包む
```ts
type Result<T> = { ok: true; value: T } | { ok: false; error: string };
```
どんな値でも同じ扱いで返せます。

## 4. 型ガード（is / in）でナローイング
```ts
function isOk<T>(r: Result<T>): r is { ok: true; value: T } {
  return r.ok;
}

function handle<T>(r: Result<T>) {
  if (isOk(r)) {
    // r は { ok: true; value: T }
    return r.value;
  }
  // r は { ok: false; error: string }
  throw new Error(r.error);
}
```

## 5. ユーティリティ型で素早く派生
`Partial<T> / Pick<T, K> / Omit<T, K> / Readonly<T> / ReturnType<F>` など。
```ts
type User = { id: string; name: string; email?: string };
type UserDraft = Partial<User>;           // 全部オプショナル
type UserLite = Pick<User, "id"|"name">;  // 一部だけ
```

## 6. `as const` と `satisfies` でリテラルを崩さない
```ts
const ROUTES = {
  home: "/",
  blog: "/blog",
} as const; // 値と型がリテラル化

type RouteKey = keyof typeof ROUTES; // "home" | "blog"

const config = {
  theme: "dark",
  perPage: 5,
} satisfies { theme: "dark" | "light"; perPage: number };
```

## 7. 判別可能ユニオン + 完全網羅チェック
```ts
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; size: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.r ** 2;
    case "square": return s.size * s.size;
    default: {
      const _exhaustive: never = s; // 新ケース追加時にエラーで気づける
      return _exhaustive;
    }
  }
}
```

## 8. Null安全：オプショナル連鎖と Null 合体
```ts
type User = { profile?: { nickname?: string } };

function label(u: User) {
  return u.profile?.nickname ?? "(no name)";
  // ?. で安全に辿り、?? でデフォルト値を補う
}
```

## 9. `Record<K, V>` で辞書型を明確に
```ts
type Role = "admin" | "user";
const perms: Record<Role, string[]> = {
  admin: ["read", "write"],
  user: ["read"],
};
```
キー集合が決まっているときに便利。

## 10. 条件型 + infer の最小例
```ts
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<number>>; // number
type B = UnwrapPromise<string>;          // string
```
ライブラリの戻り値から中身の型を取り出す時に有用。
