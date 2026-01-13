import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type SectionItem = {
    slug: string
    title: string
    route: string
    frontMatter: {
        title?: string
        order?: number
        description?: string
    }
}

export type GuideItem = {
    slug: string
    title: string
    route: string
    frontMatter: {
        title?: string
        description?: string
        order?: number
    }
    sections: SectionItem[]
}

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides')

export async function getGuides(): Promise<GuideItem[]> {
    try {
        if (!fs.existsSync(GUIDES_DIR)) {
            return []
        }

        const guideDirs = fs.readdirSync(GUIDES_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)

        const guides: GuideItem[] = []

        for (const guideSlug of guideDirs) {
            const guidePath = path.join(GUIDES_DIR, guideSlug)

            // Read guide meta from _meta.ts
            let guideMeta: any = {}
            const metaPath = path.join(guidePath, '_meta.ts')
            if (fs.existsSync(metaPath)) {
                const metaContent = fs.readFileSync(metaPath, 'utf-8')
                const titleMatch = metaContent.match(/title:\s*['"]([^'"]+)['"]/)
                const descMatch = metaContent.match(/description:\s*['"]([^'"]+)['"]/)
                const orderMatch = metaContent.match(/order:\s*(\d+)/)
                guideMeta = {
                    title: titleMatch?.[1],
                    description: descMatch?.[1],
                    order: orderMatch ? parseInt(orderMatch[1]) : undefined,
                }
            }

            // Get sections
            const sectionFiles = fs.readdirSync(guidePath)
                .filter(file => file.endsWith('.mdx'))

            const sections: SectionItem[] = sectionFiles.map(file => {
                const sectionSlug = file.replace('.mdx', '')
                const filePath = path.join(guidePath, file)
                const fileContent = fs.readFileSync(filePath, 'utf-8')
                const { data } = matter(fileContent)

                return {
                    slug: sectionSlug,
                    title: data.title || sectionSlug,
                    route: `/guides/${guideSlug}/${sectionSlug}`,
                    frontMatter: {
                        title: data.title,
                        order: data.order,
                        description: data.description,
                    }
                }
            })

            // Sort sections by order
            sections.sort((a, b) => {
                const orderA = a.frontMatter.order ?? 999
                const orderB = b.frontMatter.order ?? 999
                return orderA - orderB
            })

            guides.push({
                slug: guideSlug,
                title: guideMeta.title || guideSlug,
                route: `/guides/${guideSlug}`,
                frontMatter: guideMeta,
                sections
            })
        }

        // Sort guides by order
        guides.sort((a, b) => {
            const orderA = a.frontMatter.order ?? 999
            const orderB = b.frontMatter.order ?? 999
            return orderA - orderB
        })

        return guides
    } catch (e) {
        console.error('[getGuides] Error:', e)
        return []
    }
}

export async function getGuide(guideSlug: string): Promise<GuideItem | null> {
    const guides = await getGuides()
    return guides.find(g => g.slug === guideSlug) || null
}

export function getGuideSlugs(): string[] {
    try {
        if (!fs.existsSync(GUIDES_DIR)) {
            return []
        }
        return fs.readdirSync(GUIDES_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
    } catch {
        return []
    }
}

export function getSectionSlugs(guideSlug: string): string[] {
    try {
        const guidePath = path.join(GUIDES_DIR, guideSlug)
        if (!fs.existsSync(guidePath)) {
            return []
        }
        return fs.readdirSync(guidePath)
            .filter(file => file.endsWith('.mdx'))
            .map(file => file.replace('.mdx', ''))
    } catch {
        return []
    }
}
