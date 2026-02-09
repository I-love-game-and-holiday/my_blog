'use client'

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

// ============================================================
// 型定義
// ============================================================

type CourseProgressData = {
    completedLessons: string[]
    lastAccessedLesson: string | null
    lastAccessedAt: string
}

type CourseProgressMap = Record<string, CourseProgressData>

type CourseProgressContextValue = {
    isLessonCompleted: (courseSlug: string, lessonSlug: string) => boolean
    getCompletedCount: (courseSlug: string) => number
    getCompletionRate: (courseSlug: string, totalLessons: number) => number
    getLastAccessedLesson: (courseSlug: string) => string | null
    markLessonCompleted: (courseSlug: string, lessonSlug: string) => void
    updateLastAccessed: (courseSlug: string, lessonSlug: string) => void
    resetCourseProgress: (courseSlug: string) => void
}

// ============================================================
// 定数
// ============================================================

const STORAGE_KEY = 'tanaka101_course_progress'

const DEFAULT_COURSE_PROGRESS: CourseProgressData = {
    completedLessons: [],
    lastAccessedLesson: null,
    lastAccessedAt: '',
}

// ============================================================
// Context
// ============================================================

const CourseProgressContext = createContext<CourseProgressContextValue | null>(null)

type CourseProgressProviderProps = {
    children: ReactNode
}

export function CourseProgressProvider({ children }: CourseProgressProviderProps) {
    const [progressMap, setProgressMap] = useState<CourseProgressMap>({})
    const [isHydrated, setIsHydrated] = useState(false)

    // 初回マウント時にLocalStorageから読み込み
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored) as unknown
                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                    setProgressMap(parsed as CourseProgressMap)
                }
            }
        } catch {
            // LocalStorageが無効 or データが壊れている場合は無視
        }
        setIsHydrated(true)
    }, [])

    // progressMap変更時にLocalStorageへ保存
    useEffect(() => {
        if (!isHydrated) return
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(progressMap))
        } catch {
            // 書き込み失敗時は無視
        }
    }, [progressMap, isHydrated])

    const isLessonCompleted = useCallback((courseSlug: string, lessonSlug: string): boolean => {
        return progressMap[courseSlug]?.completedLessons.includes(lessonSlug) ?? false
    }, [progressMap])

    const getCompletedCount = useCallback((courseSlug: string): number => {
        return progressMap[courseSlug]?.completedLessons.length ?? 0
    }, [progressMap])

    const getCompletionRate = useCallback((courseSlug: string, totalLessons: number): number => {
        if (totalLessons === 0) return 0
        const completed = progressMap[courseSlug]?.completedLessons.length ?? 0
        return Math.round((completed / totalLessons) * 100)
    }, [progressMap])

    const getLastAccessedLesson = useCallback((courseSlug: string): string | null => {
        return progressMap[courseSlug]?.lastAccessedLesson ?? null
    }, [progressMap])

    const markLessonCompleted = useCallback((courseSlug: string, lessonSlug: string) => {
        setProgressMap(prev => {
            const courseData = prev[courseSlug] ?? { ...DEFAULT_COURSE_PROGRESS }

            if (courseData.completedLessons.includes(lessonSlug)) {
                return prev
            }

            return {
                ...prev,
                [courseSlug]: {
                    ...courseData,
                    completedLessons: [...courseData.completedLessons, lessonSlug],
                    lastAccessedLesson: lessonSlug,
                    lastAccessedAt: new Date().toISOString(),
                },
            }
        })
    }, [])

    const updateLastAccessed = useCallback((courseSlug: string, lessonSlug: string) => {
        setProgressMap(prev => {
            const courseData = prev[courseSlug] ?? { ...DEFAULT_COURSE_PROGRESS }

            return {
                ...prev,
                [courseSlug]: {
                    ...courseData,
                    lastAccessedLesson: lessonSlug,
                    lastAccessedAt: new Date().toISOString(),
                },
            }
        })
    }, [])

    const resetCourseProgress = useCallback((courseSlug: string) => {
        setProgressMap(prev => {
            const { [courseSlug]: _, ...rest } = prev
            return rest
        })
    }, [])

    return (
        <CourseProgressContext.Provider
            value={{
                isLessonCompleted,
                getCompletedCount,
                getCompletionRate,
                getLastAccessedLesson,
                markLessonCompleted,
                updateLastAccessed,
                resetCourseProgress,
            }}
        >
            {children}
        </CourseProgressContext.Provider>
    )
}

export function useCourseProgress() {
    const context = useContext(CourseProgressContext)
    if (!context) {
        throw new Error('useCourseProgress must be used within a CourseProgressProvider')
    }
    return context
}
