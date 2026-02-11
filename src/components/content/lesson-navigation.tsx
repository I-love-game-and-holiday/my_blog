'use client'

import Link from 'next/link'
import { useCourseProgress } from '@/contexts/course-progress-context'

type LessonNavigationProps = {
    courseSlug: string
    currentLessonSlug: string
    prevLesson: { route: string; title: string } | null
    nextLesson: { route: string; title: string } | null
    courseRoute: string
}

export function LessonNavigation({
    courseSlug,
    currentLessonSlug,
    prevLesson,
    nextLesson,
    courseRoute,
}: LessonNavigationProps) {
    const { markLessonCompleted } = useCourseProgress()

    const handleComplete = () => {
        markLessonCompleted(courseSlug, currentLessonSlug)
    }

    return (
        <nav className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4">
                {prevLesson ? (
                    <Link
                        href={prevLesson.route}
                        className="flex flex-col items-start text-left hover:opacity-80 transition-opacity"
                    >
                        <span className="text-sm text-muted-foreground">前のレッスン</span>
                        <span className="font-medium">{prevLesson.title}</span>
                    </Link>
                ) : (
                    <div />
                )}

                {nextLesson ? (
                    <Link
                        href={nextLesson.route}
                        onClick={handleComplete}
                        className="flex flex-col items-end text-right hover:opacity-80 transition-opacity"
                    >
                        <span className="text-sm text-muted-foreground">次のレッスン</span>
                        <span className="font-medium">{nextLesson.title}</span>
                    </Link>
                ) : (
                    <Link
                        href={courseRoute}
                        onClick={handleComplete}
                        className="flex flex-col items-end text-right hover:opacity-80 transition-opacity"
                    >
                        <span className="text-sm text-muted-foreground">完了</span>
                        <span className="font-medium">コース一覧に戻る</span>
                    </Link>
                )}
            </div>
        </nav>
    )
}
