/**
 * SEO用のメタデータ・構造化データ（JSON-LD）の組み立て
 *
 * 各ページの generateMetadata / metadata と、記事ページの JSON-LD はここを通して作る。
 */
import type { Metadata } from 'next'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

/** buildPageMetadata に渡すページ情報 */
type PageMetadataInput = {
    /** ページタイトル（ルートレイアウトの template で「| tanaka101」が付く） */
    title: string
    description?: string
    /** サイト内のパス（例: /learn/to-do-app）。canonical と og:url に使う */
    path: string
    /** 記事ページは 'article'、一覧などは 'website' */
    type?: 'website' | 'article'
    /** 記事の公開日（type: 'article' のとき og の article:published_time に使う） */
    publishedTime?: string
    /** 記事のタグ（type: 'article' のとき article:tag に使う） */
    tags?: string[]
}

/**
 * ページ単位のメタデータ（canonical・OGP・Twitter Card）を作る
 *
 * Next.js のメタデータは openGraph などのオブジェクトを丸ごと上書きする（深いマージはしない）。
 * そのため siteName・locale のようなサイト共通の値も、ページごとにここで毎回入れる。
 */
export function buildPageMetadata({
    title,
    description,
    path,
    type = 'website',
    publishedTime,
    tags,
}: PageMetadataInput): Metadata {
    const openGraphBase = {
        title,
        description,
        url: path,
        siteName: SITE_NAME,
        locale: 'ja_JP',
    }

    return {
        title,
        description,
        alternates: {
            canonical: path,
        },
        openGraph: type === 'article'
            ? { ...openGraphBase, type: 'article', publishedTime, tags }
            : { ...openGraphBase, type: 'website' },
        twitter: {
            card: 'summary',
            title,
            description,
        },
    }
}

/** パンくずリストの1項目（JSON-LD用）。path がない項目は現在のページ */
type BreadcrumbJsonLdItem = {
    label: string
    path?: string
}

/**
 * パンくずリストの構造化データ（BreadcrumbList）を作る
 *
 * 先頭に「ホーム」を加える。path がない最後の項目には currentPath を使う。
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbJsonLdItem[], currentPath: string) {
    const allItems = [{ label: SITE_NAME, path: '/' }, ...items]

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: allItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: toAbsoluteUrl(item.path ?? currentPath),
        })),
    }
}

/** buildArticleJsonLd に渡す記事情報 */
type ArticleJsonLdInput = {
    title: string
    description?: string
    path: string
    /** 公開日（ブログのみ。learn/guides は日付を持たないため省略） */
    datePublished?: string
}

/** 記事の構造化データ（Article）を作る */
export function buildArticleJsonLd({ title, description, path, datePublished }: ArticleJsonLdInput) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        url: toAbsoluteUrl(path),
        mainEntityOfPage: toAbsoluteUrl(path),
        datePublished,
        inLanguage: 'ja',
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
    }
}

/** サイト内のパスを絶対URLにする（JSON-LDは metadataBase で解決されないため） */
function toAbsoluteUrl(path: string): string {
    return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}
