import { getPosts } from "@/lib/get-posts"

const CONFIG = {
    title: 'tanaka101',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://tanaka101.com',
    description: 'プロゲートを終えた非エンジニア向けの学習サイト',
    lang: 'ja-jp'
}

export async function GET() {
    const allPosts = await getPosts()
    const posts = allPosts
        .map(
            post => `    <item>
        <title>${escapeXml(post.frontMatter?.title || post.title)}</title>
        <description>${escapeXml(post.frontMatter?.description || '')}</description>
        <link>${CONFIG.siteUrl}${post.route}</link>
        <pubDate>${post.frontMatter?.date ? new Date(post.frontMatter.date).toUTCString() : new Date().toUTCString()}</pubDate>
    </item>`
        )
        .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${CONFIG.title}</title>
    <link>${CONFIG.siteUrl}</link>
    <description>${CONFIG.description}</description>
    <language>${CONFIG.lang}</language>
${posts}
  </channel>
</rss>`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/rss+xml'
        }
    })
}

function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}
