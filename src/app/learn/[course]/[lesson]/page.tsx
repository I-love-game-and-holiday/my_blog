import Link from 'next/link'
import { getCourse, getCourses } from '@/lib/get-courses'
import { getLessonContent } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

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

    const { metadata, content } = result

    // Find current lesson index and navigation
    const currentIndex = course.lessons.findIndex(l => l.slug === params.lesson)
    const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null
    const nextLesson = currentIndex < course.lessons.length - 1 ? course.lessons[currentIndex + 1] : null

    return (
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

            {/* Progress indicator */}
            <div className="mb-8 p-4 bg-secondary/50 rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">
                    レッスン {currentIndex + 1} / {course.lessons.length}
                </div>
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-foreground transition-all"
                        style={{ width: `${((currentIndex + 1) / course.lessons.length) * 100}%` }}
                    />
                </div>
            </div>

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
                {content}
            </article>

            {/* Navigation */}
            <nav className="mt-12 pt-8 border-t border-border">
                <div className="flex justify-between items-center gap-4">
                    {prevLesson ? (
                        <Link
                            href={prevLesson.route}
                            className="flex flex-col items-start text-left hover:opacity-80 transition-opacity"
                        >
                            <span className="text-sm text-muted-foreground">前のレッスン</span>
                            <span className="font-medium">{prevLesson.frontMatter?.title || prevLesson.title}</span>
                        </Link>
                    ) : (
                        <div />
                    )}

                    {nextLesson ? (
                        <Link
                            href={nextLesson.route}
                            className="flex flex-col items-end text-right hover:opacity-80 transition-opacity"
                        >
                            <span className="text-sm text-muted-foreground">次のレッスン</span>
                            <span className="font-medium">{nextLesson.frontMatter?.title || nextLesson.title}</span>
                        </Link>
                    ) : (
                        <Link
                            href={course.route}
                            className="flex flex-col items-end text-right hover:opacity-80 transition-opacity"
                        >
                            <span className="text-sm text-muted-foreground">完了</span>
                            <span className="font-medium">コース一覧に戻る</span>
                        </Link>
                    )}
                </div>
            </nav>
        </div>
    )
}
