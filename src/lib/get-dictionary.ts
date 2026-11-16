/**
 * 用語集（content/dictionary/*.mdx）の読み込みと、本文中の用語の検出
 *
 * - 一覧（getDictionaryEntries）: frontmatter だけを読む軽い処理。検索や用語の自動リンクに使う
 * - 1件の詳細（getDictionaryEntry）: 本文までコンパイルする重い処理。用語ページやモーダル表示に使う
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { DICTIONARY_MDX_COMPONENTS, compileMdxSource } from '@/lib/compile-mdx'
import { getMdxSlugs, readFrontMatter } from '@/lib/content-collection'
import { isValidTermBoundary } from '@/lib/term-boundary'

/** 用語集のMDXを置くディレクトリ */
const DICTIONARY_DIR = path.join(process.cwd(), 'content', 'dictionary')

/**
 * 用語1件分のメタデータ（本文なし）
 * term・reading・aliases は frontmatter が空のときの代わりの値を入れて、必ず値がある状態にしている
 */
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

/** 用語1件分のメタデータ + コンパイル済みの本文 */
export type DictionaryEntryWithContent = DictionaryEntry & {
    content: React.ReactElement
}

/**
 * frontmatter から用語1件分のメタデータを組み立てる
 * 一覧用（getDictionaryEntries）と1件用（getDictionaryEntry）で同じ形にするための共通処理
 *
 * @param slug ファイル名（拡張子なし）
 * @param data gray-matter で読んだ frontmatter
 */
function toDictionaryEntry(slug: string, data: ReturnType<typeof readFrontMatter>): DictionaryEntry {
    const term = data.term || slug
    const aliases = data.aliases || []

    return {
        slug,
        term,
        // 読みがなければ用語名で代用する（用語集ページの五十音グループ分けに使う）
        reading: data.reading || term,
        aliases,
        route: `/dictionary/${slug}`,
        frontMatter: {
            term,
            reading: data.reading,
            aliases,
        },
    }
}

/**
 * 全用語のメタデータを、用語名の五十音・アルファベット順で返す
 * 本文はコンパイルしないので、全件取得しても軽い
 */
export async function getDictionaryEntries(): Promise<DictionaryEntry[]> {
    try {
        const entries = getMdxSlugs(DICTIONARY_DIR).map(slug =>
            toDictionaryEntry(slug, readFrontMatter(path.join(DICTIONARY_DIR, `${slug}.mdx`)))
        )

        // 用語名で並べ替える（'ja' を指定して日本語の並び順にする）
        return entries.sort((a, b) => a.term.localeCompare(b.term, 'ja'))
    } catch (error) {
        console.error('[getDictionaryEntries] Error:', error)
        return []
    }
}

/**
 * 用語1件を、本文をコンパイルした状態で返す
 *
 * 本文で使えるコンポーネントは DICTIONARY_MDX_COMPONENTS のみ（記事より少ない）。
 * 理由は compile-mdx.ts のコメントを参照。
 *
 * 読み込みやコンパイルに失敗した場合も、例外は投げずに null を返す（エラーはログに出す）。
 * 用語1件の書き間違いで、用語を使っている全記事のビルドが止まらないようにするため。
 *
 * @param slug ファイル名（拡張子なし）
 * @returns ファイルが存在しない・読み込みに失敗した場合は null
 */
export async function getDictionaryEntry(slug: string): Promise<DictionaryEntryWithContent | null> {
    try {
        const filePath = path.join(DICTIONARY_DIR, `${slug}.mdx`)

        if (!fs.existsSync(filePath)) {
            return null
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data, content } = matter(fileContent)

        const mdxContent = await compileMdxSource(content, DICTIONARY_MDX_COMPONENTS)

        return {
            ...toDictionaryEntry(slug, data),
            content: mdxContent,
        }
    } catch (error) {
        console.error(`[getDictionaryEntry] Error (${slug}):`, error)
        return null
    }
}

/** 全用語のslug（ファイル名）。generateStaticParams 用 */
export function getDictionarySlugs(): string[] {
    return getMdxSlugs(DICTIONARY_DIR)
}

/**
 * 全用語を本文付きで返す（キーはslug）
 * 記事中の用語をクリックしたときのモーダル表示用に、記事ページでまとめて渡している
 */
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
            const lowerTerm = term.toLowerCase()
            let searchIndex = 0

            while (searchIndex <= lowerContent.length - lowerTerm.length) {
                const index = lowerContent.indexOf(lowerTerm, searchIndex)
                if (index === -1) break

                if (isValidTermBoundary(mdxContent, index, lowerTerm.length, term)) {
                    foundSlugs.add(entry.slug)
                    break
                }
                searchIndex = index + 1
            }

            if (foundSlugs.has(entry.slug)) break
        }
    }

    // 見つかったエントリをterm順でソートして返す
    return entries
        .filter(entry => foundSlugs.has(entry.slug))
        .sort((a, b) => a.term.localeCompare(b.term, 'ja'))
}
