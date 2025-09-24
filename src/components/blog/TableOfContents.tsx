"use client";

import { useEffect, useState } from "react";

type Item = { id: string; text: string; level: number };

export default function TableOfContents({ target = "#post-article" }: { target?: string }) {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const container = document.querySelector(target);
    if (!container) return;
    const hs = Array.from(container.querySelectorAll("h1,h2,h3")) as HTMLElement[];

    const its = hs.map((h) => {
      const text = h.textContent || "";
      let id = h.id;
      if (!id) {
        id = text.trim().toLowerCase().replace(/\s+/g, "-");
        h.id = id;
      }
      const level = Number(h.tagName.substring(1));
      return { id, text, level };
    });

    setItems(its);
  }, [target]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-20 space-y-2 text-sm">
      <div className="font-semibold">目次</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} style={{ paddingLeft: (it.level - 1) * 12 }}>
            <a href={`#${it.id}`} className="hover:underline">
              {it.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
