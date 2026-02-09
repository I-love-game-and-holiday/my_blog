'use client'

import { useCourseProgress } from '@/contexts/course-progress-context'
import { COMPLETED_BADGE_BG } from '@/lib/constants'

type CourseProgressBadgeProps = {
    courseSlug: string
    totalLessons: number
}

export function CourseProgressBadge({ courseSlug, totalLessons }: CourseProgressBadgeProps) {
    const { getCompletionRate } = useCourseProgress()
    const rate = getCompletionRate(courseSlug, totalLessons)

    if (rate === 0) {
        return null
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${COMPLETED_BADGE_BG}`}>
            {rate === 100 ? '完了' : `${rate}%`}
        </span>
    )
}
