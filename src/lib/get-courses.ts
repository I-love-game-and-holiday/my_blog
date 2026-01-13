import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type LessonItem = {
    slug: string
    title: string
    route: string
    frontMatter: {
        title?: string
        order?: number
        description?: string
    }
}

export type CourseItem = {
    slug: string
    title: string
    route: string
    frontMatter: {
        title?: string
        description?: string
        order?: number
        goals?: string[]
    }
    lessons: LessonItem[]
}

const LEARN_DIR = path.join(process.cwd(), 'content', 'learn')

export async function getCourses(): Promise<CourseItem[]> {
    try {
        if (!fs.existsSync(LEARN_DIR)) {
            return []
        }

        const courseDirs = fs.readdirSync(LEARN_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)

        const courses: CourseItem[] = []

        for (const courseSlug of courseDirs) {
            const coursePath = path.join(LEARN_DIR, courseSlug)

            // Read course meta from _meta.ts or index.mdx
            let courseMeta: any = {}
            const metaPath = path.join(coursePath, '_meta.ts')
            if (fs.existsSync(metaPath)) {
                const metaContent = fs.readFileSync(metaPath, 'utf-8')
                // Simple parsing for title and description from export default
                const titleMatch = metaContent.match(/title:\s*['"]([^'"]+)['"]/)
                const descMatch = metaContent.match(/description:\s*['"]([^'"]+)['"]/)
                const orderMatch = metaContent.match(/order:\s*(\d+)/)
                // Parse goals array
                const goalsMatch = metaContent.match(/goals:\s*\[([\s\S]*?)\]/)
                let goals: string[] | undefined
                if (goalsMatch) {
                    goals = goalsMatch[1]
                        .match(/['"]([^'"]+)['"]/g)
                        ?.map(s => s.slice(1, -1))
                }
                courseMeta = {
                    title: titleMatch?.[1],
                    description: descMatch?.[1],
                    order: orderMatch ? parseInt(orderMatch[1]) : undefined,
                    goals,
                }
            }

            // Get lessons
            const lessonFiles = fs.readdirSync(coursePath)
                .filter(file => file.endsWith('.mdx'))

            const lessons: LessonItem[] = lessonFiles.map(file => {
                const lessonSlug = file.replace('.mdx', '')
                const filePath = path.join(coursePath, file)
                const fileContent = fs.readFileSync(filePath, 'utf-8')
                const { data } = matter(fileContent)

                return {
                    slug: lessonSlug,
                    title: data.title || lessonSlug,
                    route: `/learn/${courseSlug}/${lessonSlug}`,
                    frontMatter: {
                        title: data.title,
                        order: data.order,
                        description: data.description,
                    }
                }
            })

            // Sort lessons by order
            lessons.sort((a, b) => {
                const orderA = a.frontMatter.order ?? 999
                const orderB = b.frontMatter.order ?? 999
                return orderA - orderB
            })

            courses.push({
                slug: courseSlug,
                title: courseMeta.title || courseSlug,
                route: `/learn/${courseSlug}`,
                frontMatter: courseMeta,
                lessons
            })
        }

        // Sort courses by order
        courses.sort((a, b) => {
            const orderA = a.frontMatter.order ?? 999
            const orderB = b.frontMatter.order ?? 999
            return orderA - orderB
        })

        return courses
    } catch (e) {
        console.error('[getCourses] Error:', e)
        return []
    }
}

export async function getCourse(courseSlug: string): Promise<CourseItem | null> {
    const courses = await getCourses()
    return courses.find(c => c.slug === courseSlug) || null
}

export function getCourseSlugs(): string[] {
    try {
        if (!fs.existsSync(LEARN_DIR)) {
            return []
        }
        return fs.readdirSync(LEARN_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
    } catch {
        return []
    }
}

export function getLessonSlugs(courseSlug: string): string[] {
    try {
        const coursePath = path.join(LEARN_DIR, courseSlug)
        if (!fs.existsSync(coursePath)) {
            return []
        }
        return fs.readdirSync(coursePath)
            .filter(file => file.endsWith('.mdx'))
            .map(file => file.replace('.mdx', ''))
    } catch {
        return []
    }
}
