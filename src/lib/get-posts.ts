import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

type GetPostsOptions = {
    first?: number
    tags?: string[]
    excludeByTitle?: string
}

export type PostItem = {
    slug: string
    title: string
    route: string
    frontMatter: {
        title: string
        date: string
        tags?: string[]
        description?: string
    }
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export async function getPosts(options: GetPostsOptions = {}): Promise<PostItem[]> {
    const { first, tags, excludeByTitle } = options

    try {
        if (!fs.existsSync(BLOG_DIR)) {
            return []
        }

        const files = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.mdx'))

        let posts: PostItem[] = files.map(file => {
            const slug = file.replace('.mdx', '')
            const filePath = path.join(BLOG_DIR, file)
            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const { data } = matter(fileContent)

            return {
                slug,
                title: data.title || slug,
                route: `/blog/${slug}`,
                frontMatter: {
                    title: data.title || slug,
                    date: data.date || '',
                    tags: data.tags || [],
                    description: data.description || '',
                }
            }
        })

        // Sort by date descending
        posts = posts.sort((a, b) => {
            const dateA = new Date(a.frontMatter.date || '')
            const dateB = new Date(b.frontMatter.date || '')
            return dateB.getTime() - dateA.getTime()
        })

        // Filter by tags
        if (tags && tags.length > 0) {
            posts = posts.filter(post =>
                tags.some(tag => post.frontMatter.tags?.includes(tag))
            )
        }

        // Exclude by title
        if (excludeByTitle) {
            posts = posts.filter(post => post.title !== excludeByTitle)
        }

        // Limit
        if (first) {
            posts = posts.slice(0, first)
        }

        return posts
    } catch (e) {
        console.error('[getPosts] Error:', e)
        return []
    }
}

export function getPostSlugs(): string[] {
    try {
        if (!fs.existsSync(BLOG_DIR)) {
            return []
        }
        return fs.readdirSync(BLOG_DIR)
            .filter(file => file.endsWith('.mdx'))
            .map(file => file.replace('.mdx', ''))
    } catch {
        return []
    }
}
