/**
 * MDXのコンパイル設定と、MDX内で使えるコンポーネントの一覧
 *
 * 記事（mdx.ts）と用語集（get-dictionary.ts）の両方から使う共通部分をここにまとめている。
 * コンパイル設定を変えたいとき（プラグイン追加・テーマ変更など）は、このファイルだけ直せばよい。
 *
 * 【MDXで使えるコンポーネントを増やすとき】
 * 1. コンポーネントを import する
 * 2. 記事だけで使うなら ARTICLE_MDX_COMPONENTS に、用語集でも使うなら DICTIONARY_MDX_COMPONENTS に追加する
 *    （DICTIONARY_MDX_COMPONENTS に入れたものは、記事でも自動的に使える）
 * 3. ここに登録していないコンポーネントをMDXに書くと、ビルド時にエラーになる
 */
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import type { MDXComponents } from 'mdx/types'
import { CODE_THEME } from '@/lib/constants'
import { ContentImage } from '@/components/content/content-image'
import { ContentTable } from '@/components/content/content-table'
import { BoxDiagram } from '@/components/content/box-diagram'
import { FlowDiagram } from '@/components/content/flow-diagram'
import { SectionSummary } from '@/components/content/section-summary'
import { Callout } from '@/components/content/callout'
import { HtmlPreview } from '@/components/content/html-preview'
import { CollapsibleCode, CopyableCode, OsCommandTabs, OsCodeBlock, OsTable, CodePlayground } from '@/components/code'
import { FileTree, FileTreeFolder, FileTreeFile } from '@/components/content/file-tree'
import { LearnMore } from '@/components/content/learn-more'
import { SummaryList } from '@/components/content/summary-list'
import { ResponsivePreview } from '@/components/content/responsive-preview'

/**
 * 用語集（dictionary）のMDXで使えるコンポーネント
 *
 * 用語解説は記事内のモーダルやサイドバーなど狭い領域にも表示されるため、
 * 記事向けコンポーネントのうち基本的なものに絞っている。
 * 記事（blog/learn/guides）でもすべて使える共通セットを兼ねる。
 */
export const DICTIONARY_MDX_COMPONENTS: MDXComponents = {
    ContentImage,
    ContentTable,
    BoxDiagram,
    FlowDiagram,
    SectionSummary,
    Callout,
    OsCommandTabs,
    OsCodeBlock,
    OsTable,
    LearnMore,
    CodePlayground,
}

/**
 * 記事（blog/learn/guides）のMDXで使えるコンポーネント
 *
 * 用語集の共通セットに、ファイルツリーやプレビューなど記事向けのものを加えたもの。
 */
export const ARTICLE_MDX_COMPONENTS: MDXComponents = {
    // 用語集で使える11個をまるごと展開し、その下に記事専用のものを足している
    ...DICTIONARY_MDX_COMPONENTS,
    CollapsibleCode,
    CopyableCode,
    FileTree,
    FileTreeFolder,
    FileTreeFile,
    HtmlPreview,
    SummaryList,
    ResponsivePreview,
}

/**
 * MDXソース（frontmatter除去済み）をサイト共通の設定でコンパイルする
 *
 * - 見出しへのid付与（rehype-slug）
 * - コードハイライト（rehype-pretty-code / テーマは CODE_THEME）
 *
 * @param source frontmatterを除いたMDX本文
 * @param components MDX内で使えるコンポーネント
 * @returns 描画可能なReact要素
 */
export async function compileMdxSource(
    source: string,
    components: MDXComponents
): Promise<React.ReactElement> {
    const { content } = await compileMDX({
        source,
        components,
        options: {
            // frontmatter は呼び出し側で gray-matter により取り除き済みなので、ここでは解析しない
            parseFrontmatter: false,
            // MDX内のJavaScript式（例: コンポーネントのpropsに配列やオブジェクトを渡す書き方）を許可する
            blockJS: false,
            mdxOptions: {
                rehypePlugins: [
                    // 見出しにidを付ける。目次のリンク先になる（mdx.ts の extractHeadings と同じ規則でidを作る）
                    rehypeSlug,
                    // コードブロックの色付け。テーマは constants.ts の CODE_THEME（highlight.ts と共通）
                    [rehypePrettyCode, { theme: CODE_THEME }],
                ],
            },
        },
    })

    return content
}
