import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import GithubSlugger from 'github-slugger'
import { ContentImage } from '@/components/content-image'
import { ContentTable, BoxDiagram, FlowDiagram } from '@/components/content-table'
import { SectionSummary } from '@/components/section-summary'

const mdxComponents = {
    ContentImage,
    ContentTable,
    BoxDiagram,
    FlowDiagram,
    SectionSummary,
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface HeadingItem {
    id: string
    text: string
    level: number
}

export function extractHeadings(content: string): HeadingItem[] {
    const headingRegex = /^(#{2,4})\s+(.+)$/gm
    const headings: HeadingItem[] = []
    const slugger = new GithubSlugger()
    let match

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length
        const text = match[2].trim()
        const id = slugger.slug(text)

        headings.push({ id, text, level })
    }

    return headings
}

export async function getPostContent(slug: string) {
    const filePath = path.join(CONTENT_DIR, 'blog', `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const { content: mdxContent } = await compileMDX({
        source: content,
        components: mdxComponents,
        options: {
            parseFrontmatter: false,
            mdxOptions: {
                rehypePlugins: [rehypeSlug],
            },
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

    const headings = extractHeadings(content)

    const { content: mdxContent } = await compileMDX({
        source: content,
        components: mdxComponents,
        options: {
            parseFrontmatter: false,
            mdxOptions: {
                rehypePlugins: [rehypeSlug],
            },
        },
    })

    return {
        metadata: data,
        content: mdxContent,
        headings,
    }
}

export async function getSectionContent(guideSlug: string, sectionSlug: string) {
    const filePath = path.join(CONTENT_DIR, 'guides', guideSlug, `${sectionSlug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const headings = extractHeadings(content)

    const { content: mdxContent } = await compileMDX({
        source: content,
        components: mdxComponents,
        options: {
            parseFrontmatter: false,
            mdxOptions: {
                rehypePlugins: [rehypeSlug],
            },
        },
    })

    return {
        metadata: data,
        content: mdxContent,
        headings,
    }
}
