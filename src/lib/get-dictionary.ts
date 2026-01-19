import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import { ContentImage } from '@/components/content/content-image'
import { ContentTable } from '@/components/content/content-table'
import { BoxDiagram } from '@/components/content/box-diagram'
import { FlowDiagram } from '@/components/content/flow-diagram'
import { SectionSummary } from '@/components/content/section-summary'
import { OsCommandTabs, OsCodeBlock } from '@/components/os/os-command-tabs'
import { OsTable } from '@/components/os/os-table'

const mdxComponents = {
    ContentImage,
    ContentTable,
    BoxDiagram,
    FlowDiagram,
    SectionSummary,
    OsCommandTabs,
    OsCodeBlock,
    OsTable,
}

const DICTIONARY_DIR = path.join(process.cwd(), 'content', 'dictionary')

export type DictionaryEntry = {
    slug: string
    term: string
    aliases: string[]
    route: string
    frontMatter: {
        term: string
        aliases?: string[]
    }
}

export type DictionaryEntryWithContent = DictionaryEntry & {
    content: React.ReactElement
}

export async function getDictionaryEntries(): Promise<DictionaryEntry[]> {
    try {
        if (!fs.existsSync(DICTIONARY_DIR)) {
            return []
        }

        const files = fs.readdirSync(DICTIONARY_DIR).filter(file => file.endsWith('.mdx'))

        const entries: DictionaryEntry[] = files.map(file => {
            const slug = file.replace('.mdx', '')
            const filePath = path.join(DICTIONARY_DIR, file)
            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const { data } = matter(fileContent)

            return {
                slug,
                term: data.term || slug,
                aliases: data.aliases || [],
                route: `/dictionary/${slug}`,
                frontMatter: {
                    term: data.term || slug,
                    aliases: data.aliases || [],
                }
            }
        })

        // Sort alphabetically by term
        return entries.sort((a, b) => a.term.localeCompare(b.term, 'ja'))
    } catch (e) {
        console.error('[getDictionaryEntries] Error:', e)
        return []
    }
}

export async function getDictionaryEntry(slug: string): Promise<DictionaryEntryWithContent | null> {
    const filePath = path.join(DICTIONARY_DIR, `${slug}.mdx`)

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
        slug,
        term: data.term || slug,
        aliases: data.aliases || [],
        route: `/dictionary/${slug}`,
        frontMatter: {
            term: data.term || slug,
            aliases: data.aliases || [],
        },
        content: mdxContent,
    }
}

export function getDictionarySlugs(): string[] {
    try {
        if (!fs.existsSync(DICTIONARY_DIR)) {
            return []
        }
        return fs.readdirSync(DICTIONARY_DIR)
            .filter(file => file.endsWith('.mdx'))
            .map(file => file.replace('.mdx', ''))
    } catch {
        return []
    }
}

export async function findDictionaryEntryByTerm(term: string): Promise<DictionaryEntry | null> {
    const entries = await getDictionaryEntries()
    const lowerTerm = term.toLowerCase()

    for (const entry of entries) {
        if (entry.term.toLowerCase() === lowerTerm) {
            return entry
        }
        for (const alias of entry.aliases) {
            if (alias.toLowerCase() === lowerTerm) {
                return entry
            }
        }
    }

    return null
}

export async function getAllTermsAndAliases(): Promise<Map<string, string>> {
    const entries = await getDictionaryEntries()
    const termMap = new Map<string, string>()

    for (const entry of entries) {
        termMap.set(entry.term.toLowerCase(), entry.slug)
        for (const alias of entry.aliases) {
            termMap.set(alias.toLowerCase(), entry.slug)
        }
    }

    return termMap
}
