// src/app/api/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "Next Blog").slice(0, 80);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "white",
          padding: 64,
          fontSize: 48,
          fontWeight: 800,
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.7, marginBottom: 24 }}>
          ギラのブログ
        </div>
        <div style={{ lineHeight: 1.2 }}>{title}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
