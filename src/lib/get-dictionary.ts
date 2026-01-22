import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import { ContentImage } from '@/components/content/content-image'
import { ContentTable } from '@/components/content/content-table'
import { BoxDiagram } from '@/components/content/box-diagram'
import { FlowDiagram } from '@/components/content/flow-diagram'
import { SectionSummary } from '@/components/content/section-summary'
import { OsCommandTabs, OsCodeBlock } from '@/components/code'
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
    reading: string
    aliases: string[]
    route: string
    frontMatter: {
        term: string
        reading?: string
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
                reading: data.reading || data.term || slug,
                aliases: data.aliases || [],
                route: `/dictionary/${slug}`,
                frontMatter: {
                    term: data.term || slug,
                    reading: data.reading,
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
                rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: 'github-dark' }]],
            },
        },
    })

    return {
        slug,
        term: data.term || slug,
        reading: data.reading || data.term || slug,
        aliases: data.aliases || [],
        route: `/dictionary/${slug}`,
        frontMatter: {
            term: data.term || slug,
            reading: data.reading,
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

export async function getAllDictionaryContents(): Promise<Map<string, DictionaryEntryWithContent>> {
    const slugs = getDictionarySlugs()
    const contents = new Map<string, DictionaryEntryWithContent>()

    for (const slug of slugs) {
        const entry = await getDictionaryEntry(slug)
        if (entry) {
            contents.set(slug, entry)
        }
    }

    return contents
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

/**
 * MDXコンテンツ内で使用されている辞書用語を検出する
 * @param mdxContent MDXの生テキスト（コンパイル前）
 * @param entries 辞書エントリ一覧
 * @returns ページ内で見つかった辞書エントリ（重複なし、term順でソート）
 */
export function findDictionaryTermsInContent(
    mdxContent: string,
    entries: DictionaryEntry[]
): DictionaryEntry[] {
    const foundSlugs = new Set<string>()
    const lowerContent = mdxContent.toLowerCase()

    for (const entry of entries) {
        // term と aliases をチェック
        const termsToCheck = [entry.term, ...entry.aliases]

        for (const term of termsToCheck) {
            if (lowerContent.includes(term.toLowerCase())) {
                foundSlugs.add(entry.slug)
                break // 1つのエントリで複数マッチしても1回だけ追加
            }
        }
    }

    // 見つかったエントリをterm順でソートして返す
    return entries
        .filter(entry => foundSlugs.has(entry.slug))
        .sort((a, b) => a.term.localeCompare(b.term, 'ja'))
}
