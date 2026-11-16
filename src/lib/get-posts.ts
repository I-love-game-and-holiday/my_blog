/**
 * ブログ記事（content/blog/*.mdx）の一覧・メタデータの取得
 *
 * 記事本文の読み込みは mdx.ts の getPostContent を使う。
 */
import path from 'path'
import { getMdxSlugs, readFrontMatter } from '@/lib/content-collection'

/** getPosts の絞り込み条件（すべて省略可） */
type GetPostsOptions = {
    /** 先頭から何件返すか */
    first?: number
    /** いずれかのタグを持つ記事だけに絞る */
    tags?: string[]
    /** このタイトルの記事を除く（関連記事で自分自身を除くときなど） */
    excludeByTitle?: string
}

/** ブログ記事1つ分 */
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

/** ブログ記事を新しい順に返す。options で絞り込みできる */
export async function getPosts(options: GetPostsOptions = {}): Promise<PostItem[]> {
    const { first, tags, excludeByTitle } = options

    try {
        let posts: PostItem[] = getMdxSlugs(BLOG_DIR).map(slug => {
            const data = readFrontMatter(path.join(BLOG_DIR, `${slug}.mdx`))

            return {
                slug,
                title: data.title || slug,
                route: `/blog/${slug}`,
                frontMatter: {
                    title: data.title || slug,
                    date: data.date || '',
                    tags: data.tags || [],
                    description: data.description || '',
                },
            }
        })

        // 日付の新しい順に並べる
        posts = posts.sort((a, b) => {
            const dateA = new Date(a.frontMatter.date || '')
            const dateB = new Date(b.frontMatter.date || '')
            return dateB.getTime() - dateA.getTime()
        })

        // 指定したタグのどれかを持つ記事に絞る
        if (tags && tags.length > 0) {
            posts = posts.filter(post =>
                tags.some(tag => post.frontMatter.tags?.includes(tag))
            )
        }

        // 指定したタイトルの記事を除く
        if (excludeByTitle) {
            posts = posts.filter(post => post.title !== excludeByTitle)
        }

        // 件数を制限する
        if (first) {
            posts = posts.slice(0, first)
        }

        return posts
    } catch (error) {
        console.error('[getPosts] Error:', error)
        return []
    }
}

/** 全記事のslug（ファイル名）。generateStaticParams 用 */
export function getPostSlugs(): string[] {
    return getMdxSlugs(BLOG_DIR)
}
