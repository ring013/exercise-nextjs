export function GET() {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const body = `User-agent: *
  Allow: /
  
  Sitemap: ${base}/sitemap.xml
  `;
    return new Response(body, {
      headers: { "Content-Type": "text/plain; charset=UTF-8" },
    });
  }
  