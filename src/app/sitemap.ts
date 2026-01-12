import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/get-posts'
import { getCourses } from '@/lib/get-courses'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tanaka101.com'

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/learn`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
    ]

    // Blog posts
    const posts = await getPosts()
    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}${post.route}`,
        lastModified: post.frontMatter?.date ? new Date(post.frontMatter.date) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    // Learn courses and lessons
    const courses = await getCourses()
    const learnEntries: MetadataRoute.Sitemap = []

    for (const course of courses) {
        learnEntries.push({
            url: `${baseUrl}${course.route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        })

        for (const lesson of course.lessons) {
            learnEntries.push({
                url: `${baseUrl}${lesson.route}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        }
    }

    return [...staticPages, ...blogEntries, ...learnEntries]
}
