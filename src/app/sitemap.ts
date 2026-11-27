import type { MetadataRoute } from 'next'
import { getPosts } from '@/lib/get-posts'
import { getCourses } from '@/lib/get-courses'
import { getGuides } from '@/lib/get-guides'
import { getDictionaryEntries } from '@/lib/get-dictionary'
import { SITE_URL } from '@/lib/constants'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = SITE_URL

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/learn`,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/guides`,
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/dictionary`,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/privacy`,
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ]

    // 更新日（lastModified）は、日付がわかるブログ記事だけに入れる。
    // 生成日時を入れると全ページが毎回更新されたように見え、検索エンジンに信用されなくなる

    // ブログ記事
    const posts = await getPosts()
    const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}${post.route}`,
        lastModified: post.frontMatter?.date ? new Date(post.frontMatter.date) : undefined,
        changeFrequency: 'monthly',
        priority: 0.7,
    }))

    // 学習コースとレッスン
    const courses = await getCourses()
    const learnEntries: MetadataRoute.Sitemap = []

    for (const course of courses) {
        learnEntries.push({
            url: `${baseUrl}${course.route}`,
            changeFrequency: 'weekly',
            priority: 0.8,
        })

        for (const lesson of course.lessons) {
            learnEntries.push({
                url: `${baseUrl}${lesson.route}`,
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        }
    }

    // ガイドとセクション
    const guides = await getGuides()
    const guideEntries: MetadataRoute.Sitemap = []

    for (const guide of guides) {
        guideEntries.push({
            url: `${baseUrl}${guide.route}`,
            changeFrequency: 'weekly',
            priority: 0.8,
        })

        for (const section of guide.sections) {
            guideEntries.push({
                url: `${baseUrl}${section.route}`,
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        }
    }

    // 用語集（中身の薄いページは除く）
    // memo : Google広告で価値が低いと審査される可能性のある辞書記事をサイトマップから除外する
    const stubSlugs = new Set(['cli', 'editor', 'nodejs', 'typescript'])
    const dictionaryEntries = await getDictionaryEntries()
    const dictionaryPages: MetadataRoute.Sitemap = dictionaryEntries
        .filter((entry) => !stubSlugs.has(entry.slug))
        .map((entry) => ({
            url: `${baseUrl}${entry.route}`,
            changeFrequency: 'monthly',
            priority: 0.6,
        }))

    return [...staticPages, ...blogEntries, ...learnEntries, ...guideEntries, ...dictionaryPages]
}
