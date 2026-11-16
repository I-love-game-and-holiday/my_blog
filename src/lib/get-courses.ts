/**
 * 学習コース（content/learn/）の一覧・メタデータの取得
 *
 * フォルダの読み方は guides と同じなので、実際の処理は content-collection.ts にまとめてある。
 * レッスン本文の読み込みは mdx.ts の getLessonContent を使う。
 */
import path from 'path'
import {
    getMdxSlugs,
    getSubdirectoryNames,
    readCollections,
    type CollectionChildItem,
    type CollectionMeta,
} from '@/lib/content-collection'

/** レッスン1つ分 */
export type LessonItem = CollectionChildItem

/** コース1つ分。lessons はorder順 */
export type CourseItem = {
    slug: string
    title: string
    route: string
    frontMatter: CollectionMeta
    lessons: LessonItem[]
}

const LEARN_DIR = path.join(process.cwd(), 'content', 'learn')

/** 全コースを、レッスン一覧付き・order順で返す */
export async function getCourses(): Promise<CourseItem[]> {
    try {
        return readCollections(LEARN_DIR, '/learn').map(({ children, ...course }) => ({
            ...course,
            lessons: children,
        }))
    } catch (error) {
        console.error('[getCourses] Error:', error)
        return []
    }
}

/** コース1つを返す。見つからない場合は null */
export async function getCourse(courseSlug: string): Promise<CourseItem | null> {
    const courses = await getCourses()
    return courses.find(course => course.slug === courseSlug) || null
}

/** 全コースのslug（フォルダ名）。generateStaticParams 用 */
export function getCourseSlugs(): string[] {
    return getSubdirectoryNames(LEARN_DIR)
}

/** コース内の全レッスンのslug（ファイル名）。generateStaticParams 用 */
export function getLessonSlugs(courseSlug: string): string[] {
    return getMdxSlugs(path.join(LEARN_DIR, courseSlug))
}
