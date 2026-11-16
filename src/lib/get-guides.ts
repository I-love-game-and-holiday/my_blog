/**
 * リファレンスガイド（content/guides/）の一覧・メタデータの取得
 *
 * フォルダの読み方は learn と同じなので、実際の処理は content-collection.ts にまとめてある。
 * セクション本文の読み込みは mdx.ts の getSectionContent を使う。
 */
import path from 'path'
import {
    getMdxSlugs,
    getSubdirectoryNames,
    readCollections,
    type CollectionChildItem,
} from '@/lib/content-collection'

/** セクション1つ分 */
export type SectionItem = CollectionChildItem

/** ガイド1つ分。sections はorder順 */
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

/** 全ガイドを、セクション一覧付き・order順で返す */
export async function getGuides(): Promise<GuideItem[]> {
    try {
        return readCollections(GUIDES_DIR, '/guides').map(({ children, ...guide }) => ({
            ...guide,
            sections: children,
        }))
    } catch (error) {
        console.error('[getGuides] Error:', error)
        return []
    }
}

/** ガイド1つを返す。見つからない場合は null */
export async function getGuide(guideSlug: string): Promise<GuideItem | null> {
    const guides = await getGuides()
    return guides.find(guide => guide.slug === guideSlug) || null
}

/** 全ガイドのslug（フォルダ名）。generateStaticParams 用 */
export function getGuideSlugs(): string[] {
    return getSubdirectoryNames(GUIDES_DIR)
}

/** ガイド内の全セクションのslug（ファイル名）。generateStaticParams 用 */
export function getSectionSlugs(guideSlug: string): string[] {
    return getMdxSlugs(path.join(GUIDES_DIR, guideSlug))
}
