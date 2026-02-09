'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, RotateCcw, PlayCircle } from 'lucide-react'
import { ClickableCard } from '@/components/ui/clickable-card'
import { useCourseProgress } from '@/contexts/course-progress-context'
import { COMPLETED_BORDER, COMPLETED_CIRCLE_BG } from '@/lib/constants'
import type { LessonItem } from '@/lib/get-courses'

// ============================================================
// 続きから再開バナー
// ============================================================

type ContinueLearningBannerProps = {
    courseSlug: string
    lessons: LessonItem[]
}

export function ContinueLearningBanner({ courseSlug, lessons }: ContinueLearningBannerProps) {
    const { getLastAccessedLesson, getCompletionRate } = useCourseProgress()
    const lastAccessedSlug = getLastAccessedLesson(courseSlug)
    const rate = getCompletionRate(courseSlug, lessons.length)

    if (!lastAccessedSlug || rate === 100) {
        return null
    }

    const lesson = lessons.find(l => l.slug === lastAccessedSlug)
    if (!lesson) {
        return null
    }

    return (
        <div className="mb-6 p-4 bg-secondary/50 border border-border rounded-lg">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-sm text-muted-foreground mb-0.5">続きから</p>
                    <p className="font-medium truncate">{lesson.frontMatter?.title || lesson.title}</p>
                </div>
                <Link
                    href={lesson.route}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:bg-foreground/90 transition-colors shrink-0"
                >
                    <PlayCircle className="h-4 w-4" />
                    <span>再開</span>
                </Link>
            </div>
        </div>
    )
}

// ============================================================
// 完了チェック付きレッスンリスト
// ============================================================

type LessonListProps = {
    courseSlug: string
    lessons: LessonItem[]
}

export function LessonList({ courseSlug, lessons }: LessonListProps) {
    const { isLessonCompleted } = useCourseProgress()

    return (
        <div className="space-y-3">
            {lessons.map((lesson, index) => {
                const completed = isLessonCompleted(courseSlug, lesson.slug)

                return (
                    <ClickableCard
                        key={lesson.route}
                        href={lesson.route}
                        borderColor={completed ? COMPLETED_BORDER : undefined}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`
                                flex items-center justify-center w-8 h-8 text-sm font-medium rounded-full shrink-0
                                ${completed
                                    ? COMPLETED_CIRCLE_BG
                                    : 'bg-secondary'
                                }
                            `}>
                                {completed ? <Check className="h-4 w-4" /> : index + 1}
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
                )
            })}
        </div>
    )
}

// ============================================================
// コース開始/続きからボタン
// ============================================================

type CourseStartButtonProps = {
    courseSlug: string
    lessons: LessonItem[]
}

export function CourseStartButton({ courseSlug, lessons }: CourseStartButtonProps) {
    const { getLastAccessedLesson, getCompletionRate } = useCourseProgress()
    const lastAccessedSlug = getLastAccessedLesson(courseSlug)
    const rate = getCompletionRate(courseSlug, lessons.length)

    if (lessons.length === 0 || rate === 100) {
        return null
    }

    const targetLesson = lastAccessedSlug
        ? lessons.find(l => l.slug === lastAccessedSlug) ?? lessons[0]
        : lessons[0]

    const label = lastAccessedSlug ? '続きから学習する' : 'コースを始める'

    return (
        <div className="mt-8 pt-8 border-t border-border">
            <Link
                href={targetLesson.route}
                className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors"
            >
                {label}
            </Link>
        </div>
    )
}

// ============================================================
// 進捗リセットボタン
// ============================================================

type ResetProgressButtonProps = {
    courseSlug: string
}

export function ResetProgressButton({ courseSlug }: ResetProgressButtonProps) {
    const { getCompletedCount, resetCourseProgress } = useCourseProgress()
    const [showConfirm, setShowConfirm] = useState(false)
    const completedCount = getCompletedCount(courseSlug)

    if (completedCount === 0) {
        return null
    }

    const handleReset = () => {
        resetCourseProgress(courseSlug)
        setShowConfirm(false)
    }

    return (
        <div className="mt-8 pt-8 border-t border-border">
            {!showConfirm ? (
                <button
                    onClick={() => setShowConfirm(true)}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                    <RotateCcw className="h-3 w-3" />
                    <span>進捗をリセット</span>
                </button>
            ) : (
                <div className="flex items-center gap-3">
                    <p className="text-sm text-muted-foreground">本当にリセットしますか？</p>
                    <button
                        onClick={handleReset}
                        className="text-sm font-medium text-red-600 hover:underline"
                    >
                        リセット
                    </button>
                    <button
                        onClick={() => setShowConfirm(false)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        キャンセル
                    </button>
                </div>
            )}
        </div>
    )
}
