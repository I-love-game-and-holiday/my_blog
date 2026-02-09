import Link from 'next/link'
import { getCourse, getCourses } from '@/lib/get-courses'
import { getLessonContent } from '@/lib/mdx'
import { getDictionaryEntries, findDictionaryTermsInContent } from '@/lib/get-dictionary'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArticleLayout } from '@/components/layout/article-layout'
import { MdxContentWrapper } from '@/components/dictionary/mdx-components'
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

    return {
        title: lesson?.frontMatter?.title,
        description: lesson?.frontMatter?.description,
    }
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

    // Find current lesson index and navigation
    const currentIndex = course.lessons.findIndex(l => l.slug === params.lesson)
    const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
    const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

    return (
        <ArticleLayout>
            <div className="container py-12">
                {/* Breadcrumb */}
                <nav className="text-sm text-muted-foreground mb-6">
                    <Link href="/learn" className="hover:text-foreground transition-colors">
                        Learn
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={course.route} className="hover:text-foreground transition-colors">
                        {course.frontMatter?.title || course.title}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">
                        {metadata?.title}
                    </span>
                </nav>

                {/* 進捗トラッカー */}
                <LessonViewTracker courseSlug={params.course} lessonSlug={params.lesson} />

                {/* Course sidebar (left) */}
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

                {/* Dictionary sidebar (right) */}
                <DictionarySidebar pageTerms={pageTerms} />



                <article className="prose max-w-none">
                    <header className="mb-8 not-prose">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">
                            {metadata?.title}
                        </h1>
                        {metadata?.description && (
                            <p className="text-muted-foreground">
                                {metadata.description}
                            </p>
                        )}
                    </header>
                    <MdxContentWrapper dictionaryEntries={dictionaryEntries}>
                        {content}
                    </MdxContentWrapper>
                </article>

                {/* Navigation */}
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
