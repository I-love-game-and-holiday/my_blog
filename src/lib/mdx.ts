/**
 * 記事（blog / learn / guides）のMDXファイルを読み込み、ページ表示用のデータに変換する
 *
 * 一覧表示用のメタデータだけが欲しい場合は get-posts.ts / get-courses.ts / get-guides.ts を使う。
 * このファイルは「1記事分の本文」を表示するときに使う。
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import { ARTICLE_MDX_COMPONENTS, compileMdxSource } from '@/lib/compile-mdx'

/** コンテンツのルートディレクトリ（content/） */
const CONTENT_DIR = path.join(process.cwd(), 'content')

/** 目次に表示する見出し1つ分 */
export interface HeadingItem {
    /** 見出しのid（ページ内リンク #id の飛び先） */
    id: string
    /** 見出しの文字列 */
    text: string
    /** 見出しレベル（2〜4。## なら 2） */
    level: number
}

/**
 * MDX本文から目次用の見出し（h2〜h4）を取り出す
 *
 * idは GithubSlugger で作る。コンパイル時に rehype-slug が付けるidと同じ規則なので、
 * ここで作ったidをリンク先にすると、本文の見出しに正しく飛べる。
 * h1 は記事タイトルとして別に表示するため対象外にしている。
 *
 * @param content frontmatterを除いたMDX本文
 */
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

/**
 * 記事MDXファイルを読み込み、メタデータ・本文・目次用の見出しを返す
 *
 * blog / learn / guides で処理は同じで、違うのはファイルの場所だけ。
 * そのため下の3つの公開関数は、パスを組み立ててこの関数を呼ぶだけにしている。
 *
 * @param filePath MDXファイルの絶対パス
 * @returns ファイルが存在しない場合は null（呼び出し側で notFound() にする）
 *   - metadata: frontmatter（title, description など）
 *   - content: 表示できる状態にコンパイルした本文
 *   - headings: 目次用の見出し一覧
 *   - rawContent: コンパイル前の本文（ページ内の辞書用語を探すのに使う）
 */
async function loadArticleContent(filePath: string) {
    if (!fs.existsSync(filePath)) {
        return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)

    const headings = extractHeadings(content)
    const mdxContent = await compileMdxSource(content, ARTICLE_MDX_COMPONENTS)

    return {
        metadata: data,
        content: mdxContent,
        headings,
        rawContent: content,
    }
}

/** ブログ記事を読み込む（content/blog/{slug}.mdx） */
export async function getPostContent(slug: string) {
    return loadArticleContent(path.join(CONTENT_DIR, 'blog', `${slug}.mdx`))
}

/** 学習コースのレッスンを読み込む（content/learn/{courseSlug}/{lessonSlug}.mdx） */
export async function getLessonContent(courseSlug: string, lessonSlug: string) {
    return loadArticleContent(path.join(CONTENT_DIR, 'learn', courseSlug, `${lessonSlug}.mdx`))
}

/** ガイドのセクションを読み込む（content/guides/{guideSlug}/{sectionSlug}.mdx） */
export async function getSectionContent(guideSlug: string, sectionSlug: string) {
    return loadArticleContent(path.join(CONTENT_DIR, 'guides', guideSlug, `${sectionSlug}.mdx`))
}
