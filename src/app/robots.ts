import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/constants'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = SITE_URL
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}