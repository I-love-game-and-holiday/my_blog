import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export async function getPostContent(slug: string) {
    const filePath = path.join(CONTENT_DIR, 'blog', `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const { content: mdxContent } = await compileMDX({
        source: content,
        options: {
            parseFrontmatter: false,
        },
    })

    return {
        metadata: data,
        content: mdxContent,
    }
}

export async function getLessonContent(courseSlug: string, lessonSlug: string) {
    const filePath = path.join(CONTENT_DIR, 'learn', courseSlug, `${lessonSlug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const { content: mdxContent } = await compileMDX({
        source: content,
        options: {
            parseFrontmatter: false,
        },
    })

    return {
        metadata: data,
        content: mdxContent,
    }
}
