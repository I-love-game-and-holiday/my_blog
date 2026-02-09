'use client'

import { useEffect } from 'react'
import { useCourseProgress } from '@/contexts/course-progress-context'

type LessonViewTrackerProps = {
    courseSlug: string
    lessonSlug: string
}

/**
 * レッスンページ訪問時に最終アクセス情報を記録する。
 * UIは持たない。
 */
export function LessonViewTracker({ courseSlug, lessonSlug }: LessonViewTrackerProps) {
    const { updateLastAccessed } = useCourseProgress()

    useEffect(() => {
        updateLastAccessed(courseSlug, lessonSlug)
    }, [courseSlug, lessonSlug, updateLastAccessed])

    return null
}
