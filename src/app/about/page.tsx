// src/app/about/page.tsx
export const revalidate = 3600;

export default function AboutPage() {
  return (
    <section className="max-w-[720px] mx-auto p-4 prose prose-zinc prose-invert">
      <h1>このブログについて</h1>
      <p>
        このサイトは Next.js（App Router）と Markdown を使って作成した
        学習用ブログです。記事は <code>src/content/blog</code> の
        Markdown ファイルから自動で読み込まれます。
      </p>
      <h2>技術スタック</h2>
      <ul>
        <li>Next.js App Router</li>
        <li>TypeScript</li>
        <li>gray-matter / remark / rehype-highlight</li>
        <li>Tailwind CSS（Typography）</li>
      </ul>
      <h2>このブログで練習していること</h2>
      <ul>
        <li>SSG / ISR（静的生成と増分再生成）</li>
        <li>Markdown ベースのコンテンツ管理</li>
        <li>タグによる分類と検索</li>
      </ul>
    </section>
  );
}
