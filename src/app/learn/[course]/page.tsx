import Link from 'next/link'
import { getCourse, getCourseSlugs } from '@/lib/get-courses'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CourseGoals } from '@/components/content/course-goals'
import { ClickableCard } from '@/components/ui/clickable-card'

type PageParams = {
    course: string
}

type PageProps = {
    params: Promise<PageParams>
}

export async function generateStaticParams() {
    const slugs = getCourseSlugs()
    return slugs.map(course => ({ course }))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params
    const course = await getCourse(params.course)
    if (!course) return {}
    return {
        title: course.frontMatter?.title || course.title,
        description: course.frontMatter?.description,
    }
}

export default async function CoursePage(props: PageProps) {
    const params = await props.params
    const course = await getCourse(params.course)

    if (!course) {
        notFound()
    }

    return (
        <div className="container py-12">
            <div className="mb-8">
                <Link
                    href="/learn"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 inline-block"
                >
                    ← コース一覧に戻る
                </Link>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    {course.frontMatter?.title || course.title}
                </h1>
                {course.frontMatter?.description && (
                    <p className="text-muted-foreground">
                        {course.frontMatter.description}
                    </p>
                )}
            </div>

            {course.frontMatter?.goals && (
                <CourseGoals goals={course.frontMatter.goals} />
            )}

            {course.lessons.length === 0 ? (
                <p className="text-muted-foreground">まだレッスンがありません。</p>
            ) : (
                <div className="space-y-3">
                    {course.lessons.map((lesson, index) => (
                        <ClickableCard key={lesson.route} href={lesson.route}>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center justify-center w-8 h-8 text-sm font-medium bg-secondary rounded-full shrink-0">
                                    {index + 1}
                                </span>
                                <div>
                                    <h3 className="font-medium group-hover:underline">
                                        {lesson.frontMatter?.title || lesson.title}
                                    </h3>
                                    {lesson.frontMatter?.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {lesson.frontMatter.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </ClickableCard>
                    ))}
                </div>
            )}

            {course.lessons.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border">
                    <Link
                        href={course.lessons[0].route}
                        className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
                    >
                        コースを始める
                    </Link>
                </div>
            )}
        </div>
    )
}
