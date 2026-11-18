import { getCourse, getCourses } from '@/lib/get-courses'
import { getLessonContent } from '@/lib/mdx'
import { getDictionaryEntries, findDictionaryTermsInContent } from '@/lib/get-dictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildPageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/seo/json-ld'
import { ArticleLayout } from '@/components/layout/article-layout'
import { Breadcrumb } from '@/components/layout/breadcrumb'
import { TermAutoLink } from '@/components/dictionary/term-auto-link-client'
import { ContentSidebar } from '@/components/layout/content-sidebar'
import { DictionarySidebar } from '@/components/layout/dictionary-sidebar'
import { LessonNavigation } from '@/components/content/lesson-navigation'
import { LessonViewTracker } from '@/components/content/lesson-view-tracker'

type PageParams = {
    course: string
    lesson: string
}

type PageProps = {
    params: Promise<PageParams>
}

export async function generateStaticParams() {
    const courses = await getCourses()
    const params: PageParams[] = []

    for (const course of courses) {
        for (const lesson of course.lessons) {
            params.push({
                course: course.slug,
                lesson: lesson.slug,
            })
        }
    }

    return params
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const course = await getCourse(params.course)
    const lesson = course?.lessons.find(l => l.slug === params.lesson)
    if (!lesson) return {}

    return buildPageMetadata({
        title: lesson.frontMatter?.title || lesson.title,
        description: lesson.frontMatter?.description,
        path: lesson.route,
        type: 'article',
    })
}

export default async function LessonPage(props: PageProps) {
    const params = await props.params
    const course = await getCourse(params.course)

    if (!course) {
        notFound()
    }

    const result = await getLessonContent(params.course, params.lesson)

    if (!result) {
        notFound()
    }

    const { metadata, content, headings, rawContent } = result
    const dictionaryEntries = await getDictionaryEntries()
    const pageTerms = findDictionaryTermsInContent(rawContent, dictionaryEntries)

    // 現在のレッスンの位置と、前後のレッスンを求める
    const currentIndex = course.lessons.findIndex(l => l.slug === params.lesson)
    const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
    const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

    const lessonPath = course.lessons[currentIndex]?.route ?? `${course.route}/${params.lesson}`
    const breadcrumbItems = [
        { label: 'Learn', href: '/learn' },
        { label: course.frontMatter?.title || course.title, href: course.route },
        { label: metadata?.title },
    ]

    return (
        <ArticleLayout>
            <div className="container py-12">
                {/* 構造化データ（検索結果のパンくず・記事情報） */}
                <JsonLd data={buildBreadcrumbJsonLd(breadcrumbItems.map(item => ({ label: item.label, path: item.href })), lessonPath)} />
                <JsonLd data={buildArticleJsonLd({ title: metadata?.title, description: metadata?.description, path: lessonPath })} />

                {/* パンくずリスト */}
                <Breadcrumb items={breadcrumbItems} />

                {/* 進捗トラッカー */}
                <LessonViewTracker courseSlug={params.course} lessonSlug={params.lesson} />

                {/* コースのサイドバー（左） */}
                <ContentSidebar
                    title="コース内容"
                    parentRoute={course.route}
                    parentTitle={course.frontMatter?.title || course.title}
                    items={course.lessons}
                    itemsLabel="レッスン一覧"
                    currentSlug={params.lesson}
                    currentIndex={currentIndex}
                    headings={headings}
                    goals={course.frontMatter?.goals}
                    courseSlug={params.course}
                />

                {/* 辞書のサイドバー（右） */}
                <DictionarySidebar pageTerms={pageTerms} />



                <article className="prose max-w-none">
                    <header className="mb-8 not-prose">
                        <h1 className="text-page-title font-bold tracking-tight mb-2">
                            {metadata?.title}
                        </h1>
                        {metadata?.description && (
                            <p className="text-muted-foreground">
                                {metadata.description}
                            </p>
                        )}
                    </header>
                    <TermAutoLink dictionaryEntries={dictionaryEntries}>
                        {content}
                    </TermAutoLink>
                </article>

                {/* 前後のレッスンへのナビゲーション */}
                <LessonNavigation
                    courseSlug={params.course}
                    currentLessonSlug={params.lesson}
                    prevLesson={prevLesson ? {
                        route: prevLesson.route,
                        title: prevLesson.frontMatter?.title || prevLesson.title,
                    } : null}
                    nextLesson={nextLesson ? {
                        route: nextLesson.route,
                        title: nextLesson.frontMatter?.title || nextLesson.title,
                    } : null}
                    courseRoute={course.route}
                />
            </div>
        </ArticleLayout>
    )
}
