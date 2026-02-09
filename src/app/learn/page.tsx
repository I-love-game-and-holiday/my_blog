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
                    基礎を学んだあなたが、次に進むためのハンズオンコース。
                    <br />
                    ステップバイステップで実践スキルを身につけましょう。
                </p>
            </div>

            {courses.length === 0 ? (
                <p className="text-muted-foreground">まだコースがありません。</p>
            ) : (
                <div className="grid gap-6">
                    {courses.map((course) => (
                        <ClickableCard
                            key={course.route}
                            href={course.route}
                            padding="none"
                            className="p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h2 className="text-xl font-semibold group-hover:underline">
                                            {course.frontMatter?.title || course.title}
                                        </h2>
                                        <CourseProgressBadge
                                            courseSlug={course.slug}
                                            totalLessons={course.lessons.length}
                                        />
                                    </div>
                                    {course.frontMatter?.description && (
                                        <p className="text-muted-foreground text-sm">
                                            {course.frontMatter.description}
                                        </p>
                                    )}
                                </div>
                                <div className="text-sm text-muted-foreground shrink-0">
                                    {course.lessons.length} lessons
                                </div>
                            </div>
                        </ClickableCard>
                    ))}
                </div>
            )}
        </div>
    )
}
