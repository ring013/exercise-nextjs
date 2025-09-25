import { format } from "date-fns";
import { ja } from "date-fns/locale";

/** yyyy年MM月dd日 表示 */
export function formatJa(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return format(d, "yyyy年MM月dd日", { locale: ja });
}

/**
 * 読了時間（日本語向けざっくり推定）
 * - HTMLからテキストを抽出
 * - 全角・半角の空白を削って「実文字数」を数える
 * - 1分=500文字想定で丸め
 * 例: "約 3 分"
 */
export function readingTimeJa(html: string): string {
  // HTML → テキスト
  const text = html
    .replace(/<[^>]+>/g, " ")      // タグ除去
    .replace(/&nbsp;|&lt;|&gt;|&amp;|&quot;|&#39;/g, " "); // エンティティ簡易除去

  // 空白（半角/全角/改行/タブ）を除いた“見える文字数”
  const visibleChars = (text || "").replace(/\s|\u3000/g, "").length;

  // だいたい500文字/分 で推定（最低1分）
  const minutes = Math.max(1, Math.round(visibleChars / 500));

  return `約 ${minutes} 分`;
}
