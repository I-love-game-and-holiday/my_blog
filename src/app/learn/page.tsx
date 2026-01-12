import Link from 'next/link'
import { getCourses } from '@/lib/get-courses'

export const metadata = {
    title: 'Learn',
    description: 'プロゲートを終えた人のための実践的なハンズオンコース',
}

export default async function LearnPage() {
    const courses = await getCourses()

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Learn</h1>
                <p className="text-muted-foreground">
                    プロゲートを終えた人のための実践的なハンズオンコース。
                    <br />
                    ステップバイステップで次のレベルへ。
                </p>
            </div>

            {courses.length === 0 ? (
                <p className="text-muted-foreground">まだコースがありません。</p>
            ) : (
                <div className="grid gap-6">
                    {courses.map((course) => (
                        <Link
                            key={course.route}
                            href={course.route}
                            className="group block p-6 border border-border rounded-lg hover:border-foreground/20 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold mb-1 group-hover:underline">
                                        {course.frontMatter?.title || course.title}
                                    </h2>
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
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
