import Link from 'next/link'
import { getCourse, getCourseSlugs } from '@/lib/get-courses'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CourseGoals } from '@/components/content/course-goals'
import { CourseProgressBadge } from '@/components/content/course-progress-badge'
import {
    ContinueLearningBanner,
    LessonList,
    CourseStartButton,
    ResetProgressButton,
} from '@/components/content/course-detail-client'

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
                    &larr; コース一覧に戻る
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {course.frontMatter?.title || course.title}
                    </h1>
                    <CourseProgressBadge
                        courseSlug={course.slug}
                        totalLessons={course.lessons.length}
                    />
                </div>
                {course.frontMatter?.description && (
                    <p className="text-muted-foreground">
                        {course.frontMatter.description}
                    </p>
                )}
            </div>

            {course.frontMatter?.goals && (
                <CourseGoals goals={course.frontMatter.goals} />
            )}

            <ContinueLearningBanner courseSlug={course.slug} lessons={course.lessons} />

            {course.lessons.length === 0 ? (
                <p className="text-muted-foreground">まだレッスンがありません。</p>
            ) : (
                <LessonList courseSlug={course.slug} lessons={course.lessons} />
            )}

            <CourseStartButton courseSlug={course.slug} lessons={course.lessons} />

            <ResetProgressButton courseSlug={course.slug} />
        </div>
    )
}
