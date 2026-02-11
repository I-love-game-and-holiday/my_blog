import { getCourses } from '@/lib/get-courses'
import { ClickableCard } from '@/components/ui/clickable-card'
import { CourseProgressBadge } from '@/components/content/course-progress-badge'

export const metadata = {
    title: 'Learn',
    description: '基礎を学んだ次に進むためのハンズオンコース',
}

export default async function LearnPage() {
    const courses = await getCourses()

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Learn</h1>
                <p className="text-muted-foreground">
                    作りながら学ぶ実践コース
                </p>
            </div>

            {courses.length === 0 ? (
                <p className="text-muted-foreground">まだコースがありません。</p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {courses.map((course) => (
                        <ClickableCard
                            key={course.route}
                            href={course.route}
                            padding="none"
                            className="flex flex-col gap-3 p-6"
                        >
                            <h2 className="text-xl font-semibold group-hover:underline">
                                {course.frontMatter?.title || course.title}
                            </h2>
                            {course.frontMatter?.description && (
                                <p className="text-muted-foreground text-sm">
                                    {course.frontMatter.description}
                                </p>
                            )}
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span>{course.lessons.length} lessons</span>
                                <CourseProgressBadge
                                    courseSlug={course.slug}
                                    totalLessons={course.lessons.length}
                                />
                            </div>
                        </ClickableCard>
                    ))}
                </div>
            )}
        </div>
    )
}
