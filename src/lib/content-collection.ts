/**
 * content/ 配下のファイルを読むための共通処理
 *
 * get-posts.ts / get-courses.ts / get-guides.ts / get-dictionary.ts で同じ処理を何度も書かないよう、
 * 「フォルダ内のMDXを探す」「order で並べる」「_meta.ts を読む」といった部品をここにまとめている。
 *
 * 【コレクションとは】
 * learn（コース）と guides（ガイド）は、どちらも次の同じ形をしている。このファイルではこれを「コレクション」と呼ぶ。
 *
 *   content/learn/{コレクション}/
 *     ├── _meta.ts      … タイトル・説明・並び順
 *     ├── 01-xxx.mdx    … 中身の記事（コースならレッスン、ガイドならセクション）
 *     └── 02-xxx.mdx
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

/** order が指定されていないときの並び順。大きな値にして末尾に回す */
export const DEFAULT_ORDER = 999

/** コレクション（コース・ガイド）の _meta.ts から読み取る情報 */
export type CollectionMeta = {
    title?: string
    description?: string
    order?: number
    /** コースのゴール一覧（現状 learn のみで使用） */
    goals?: string[]
}

/** コレクションの中の記事1つ分（コースのレッスン、ガイドのセクション） */
export type CollectionChildItem = {
    slug: string
    title: string
    route: string
    frontMatter: {
        title?: string
        order?: number
        description?: string
    }
}

/** コレクション1つ分。children が中の記事一覧（order順） */
export type Collection = {
    slug: string
    title: string
    route: string
    frontMatter: CollectionMeta
    children: CollectionChildItem[]
}

/**
 * フォルダ内のMDXファイル名（拡張子なし）を一覧で返す
 * フォルダが存在しない・読めない場合は空配列を返す
 */
export function getMdxSlugs(dirPath: string): string[] {
    try {
        if (!fs.existsSync(dirPath)) {
            return []
        }
        return fs.readdirSync(dirPath)
            .filter(file => file.endsWith('.mdx'))
            .map(file => file.replace('.mdx', ''))
    } catch (error) {
        console.error('[getMdxSlugs] Error:', error)
        return []
    }
}

/**
 * フォルダ直下のサブフォルダ名を一覧で返す（learn のコース一覧、guides のガイド一覧に使う）
 * フォルダが存在しない・読めない場合は空配列を返す
 */
export function getSubdirectoryNames(dirPath: string): string[] {
    try {
        if (!fs.existsSync(dirPath)) {
            return []
        }
        return fs.readdirSync(dirPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
    } catch (error) {
        console.error('[getSubdirectoryNames] Error:', error)
        return []
    }
}

/**
 * MDXファイルの frontmatter（先頭の --- で囲まれた部分）だけを読む
 * 本文はコンパイルしないので軽い。一覧表示用
 */
export function readFrontMatter(filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    return matter(fileContent).data
}

/**
 * frontMatter.order の小さい順に並べ替える（order がないものは末尾）
 * 渡した配列そのものを並べ替えて、その配列を返す
 */
export function sortByOrder<T extends { frontMatter: { order?: number } }>(items: T[]): T[] {
    return items.sort((a, b) => {
        const orderA = a.frontMatter.order ?? DEFAULT_ORDER
        const orderB = b.frontMatter.order ?? DEFAULT_ORDER
        return orderA - orderB
    })
}

/**
 * コレクションの _meta.ts を読む
 *
 * _meta.ts は TypeScript ファイルだが、import はせず、文字列として読んで正規表現で値を取り出している。
 * そのため読めるのは「引用符で囲んだ文字列・数値をそのまま書いたもの」だけ（変数や式は使えない）。
 *
 * @param collectionPath コレクションのフォルダ（例: content/learn/to-do-app）
 * @returns _meta.ts がない場合は空オブジェクト
 */
export function readCollectionMeta(collectionPath: string): CollectionMeta {
    const metaPath = path.join(collectionPath, '_meta.ts')
    if (!fs.existsSync(metaPath)) {
        return {}
    }

    const metaContent = fs.readFileSync(metaPath, 'utf-8')
    const titleMatch = metaContent.match(/title:\s*['"]([^'"]+)['"]/)
    const descriptionMatch = metaContent.match(/description:\s*['"]([^'"]+)['"]/)
    const orderMatch = metaContent.match(/order:\s*(\d+)/)

    // goals: ['...', '...'] の [] の中身を取り出し、さらに引用符で囲まれた文字列を1つずつ取り出す
    const goalsMatch = metaContent.match(/goals:\s*\[([\s\S]*?)\]/)
    const goals = goalsMatch?.[1]
        .match(/['"]([^'"]+)['"]/g)
        ?.map(quoted => quoted.slice(1, -1))

    return {
        title: titleMatch?.[1],
        description: descriptionMatch?.[1],
        order: orderMatch ? parseInt(orderMatch[1], 10) : undefined,
        goals,
    }
}

/**
 * コレクション内の記事一覧を、order順で返す
 *
 * @param collectionPath コレクションのフォルダ
 * @param collectionRoute コレクションのURL（例: /learn/to-do-app）。記事のURLはこの後ろに slug を付けたもの
 */
function readCollectionChildren(collectionPath: string, collectionRoute: string): CollectionChildItem[] {
    const children = getMdxSlugs(collectionPath).map(slug => {
        const data = readFrontMatter(path.join(collectionPath, `${slug}.mdx`))

        return {
            slug,
            title: data.title || slug,
            route: `${collectionRoute}/${slug}`,
            frontMatter: {
                title: data.title,
                order: data.order,
                description: data.description,
            },
        }
    })

    return sortByOrder(children)
}

/**
 * フォルダ内の全コレクションを、order順で返す
 *
 * @param baseDir コレクションを並べているフォルダ（例: content/learn）
 * @param baseRoute そのURL（例: /learn）
 */
export function readCollections(baseDir: string, baseRoute: string): Collection[] {
    const collections = getSubdirectoryNames(baseDir).map(slug => {
        const collectionPath = path.join(baseDir, slug)
        const route = `${baseRoute}/${slug}`
        const meta = readCollectionMeta(collectionPath)

        return {
            slug,
            title: meta.title || slug,
            route,
            frontMatter: meta,
            children: readCollectionChildren(collectionPath, route),
        }
    })

    return sortByOrder(collections)
}
