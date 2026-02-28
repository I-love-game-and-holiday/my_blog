import type { MetadataRoute } from 'next'
import { getCourses } from '@/lib/get-courses'
import { getGuides } from '@/lib/get-guides'
import { getDictionaryEntries } from '@/lib/get-dictionary'

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
            url: `${baseUrl}/guides`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/dictionary`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ]

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

    // Guides and sections
    const guides = await getGuides()
    const guideEntries: MetadataRoute.Sitemap = []

    for (const guide of guides) {
        guideEntries.push({
            url: `${baseUrl}${guide.route}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        })

        for (const section of guide.sections) {
            guideEntries.push({
                url: `${baseUrl}${section.route}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        }
    }

    // Dictionary entries (exclude stub pages)
    // memo : Google広告で価値が低いと審査される可能性のある辞書記事をサイトマップから除外する
    const stubSlugs = new Set(['cli', 'editor', 'nodejs', 'typescript'])
    const dictionaryEntries = await getDictionaryEntries()
    const dictionaryPages: MetadataRoute.Sitemap = dictionaryEntries
        .filter((entry) => !stubSlugs.has(entry.slug))
        .map((entry) => ({
            url: `${baseUrl}${entry.route}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        }))

    return [...staticPages, ...learnEntries, ...guideEntries, ...dictionaryPages]
}
