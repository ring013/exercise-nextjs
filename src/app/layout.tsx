// src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
const siteName = "Gira'sBlog";
const siteDescription =
  "Next.js・Markdown・App Router・検索・RSS・OGPの“学びを形にする”コンパクトな技術ブログ。";

export const metadata: Metadata = {
  title: {
    default: siteName,
    template: `%s · ${siteName}`,
  },
  description: siteDescription,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    siteName,
    url: siteUrl,
    title: siteName,
    description: siteDescription,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-zinc-950 text-zinc-50">
        {/* Header */}
        <header className="border-b border-zinc-800">
          <div className="max-w-[960px] mx-auto p-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-extrabold tracking-wide hover:opacity-90">
              Gira&apos;sBlog
            </Link>
            <nav className="flex items-center gap-5 text-sm">
              <Link href="/" className="hover:opacity-80">Home</Link>
              <Link href="/blog" className="hover:opacity-80">Blog</Link>
              <Link href="/about" className="hover:opacity-80">About</Link>
              {/* <Link href="/rss.xml" className="hover:opacity-80">RSS</Link> */}
            </nav>
          </div>
        </header>

        <main className="pb-10">{children}</main>

        <footer className="border-t border-zinc-800">
          <div className="max-w-[960px] mx-auto p-4 text-xs text-zinc-400">
            © {new Date().getFullYear()} ギラ Blog
          </div>
        </footer>
      </body>
    </html>
  );
}
