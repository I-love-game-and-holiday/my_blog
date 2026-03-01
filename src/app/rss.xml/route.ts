const CONFIG = {
    title: 'tanaka101',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://tanaka101.com',
    description: 'プロゲートを終えた非エンジニア向けの学習サイト',
    lang: 'ja-jp'
}

export async function GET() {
    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
  </channel>
</rss>`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/rss+xml'
        }
    })
}
