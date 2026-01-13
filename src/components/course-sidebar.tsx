'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronsRight, ChevronRight, Target, BookOpen, Check } from 'lucide-react'
import type { CourseItem, LessonItem } from '@/lib/get-courses'
import { HEADER_HEIGHT } from '@/lib/constants'

const SIDEBAR_VISITED_KEY = 'course-sidebar-visited'

interface CourseSidebarProps {
    course: CourseItem
    currentLessonSlug: string
    currentIndex: number
}

export function CourseSidebar({ course, currentLessonSlug, currentIndex }: CourseSidebarProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)
    const goals = course.frontMatter?.goals || []

    useEffect(() => {
        const hasVisited = localStorage.getItem(SIDEBAR_VISITED_KEY)
        if (!hasVisited) {
            setIsOpen(true)
            localStorage.setItem(SIDEBAR_VISITED_KEY, 'true')
        }
        setIsInitialized(true)
    }, [])

    return (
        <>
            {/* Mobile: Top bar */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border"
                >
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium text-sm">コース内容</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                    <div className="mt-2 p-4 bg-secondary/30 rounded-lg border border-border">
                        <SidebarContent
                            course={course}
                            goals={goals}
                            currentLessonSlug={currentLessonSlug}
                            currentIndex={currentIndex}
                        />
                    </div>
                )}
            </div>

            {/* Desktop: Left edge trigger area */}
            <div className={`hidden lg:block ${!isInitialized ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
                {/* Full-height clickable area on left edge */}
                <button
                    onClick={() => setIsOpen(true)}
                    style={{ top: HEADER_HEIGHT }}
                    className={`
                        fixed left-0 h-[calc(100%-56px)] w-6
                        bg-transparent hover:bg-muted-foreground/20
                        transition-colors cursor-pointer z-40
                        ${isOpen ? 'pointer-events-none' : ''}
                    `}
                    aria-label="コース内容を開く"
                />

                {/* Open indicator with chevrons */}
                <div
                    style={{ top: HEADER_HEIGHT + 12 }}
                    className={`
                        fixed left-1 z-40
                        pointer-events-none
                        transition-opacity
                        ${isOpen ? 'opacity-0' : 'opacity-100'}
                    `}
                >
                    <ChevronsRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Slide-out panel */}
                <div
                    style={{ top: HEADER_HEIGHT }}
                    className={`
                        fixed left-0 h-[calc(100%-56px)] w-80 z-50
                        bg-background border-r border-border shadow-xl
                        transform transition-transform duration-300 ease-in-out
                        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                        overflow-y-auto
                    `}
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg">コース内容</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-secondary rounded"
                                aria-label="閉じる"
                            >
                                <ChevronRight className="h-5 w-5 rotate-180" />
                            </button>
                        </div>
                        <SidebarContent
                            course={course}
                            goals={goals}
                            currentLessonSlug={currentLessonSlug}
                            currentIndex={currentIndex}
                        />
                    </div>
                </div>

                {/* Backdrop */}
                {isOpen && (
                    <div
                        style={{ top: HEADER_HEIGHT }}
                        className="fixed inset-x-0 bottom-0 bg-black/20 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </div>
        </>
    )
}

interface SidebarContentProps {
    course: CourseItem
    goals: string[]
    currentLessonSlug: string
    currentIndex: number
}

function SidebarContent({ course, goals, currentLessonSlug, currentIndex }: SidebarContentProps) {
    return (
        <div className="space-y-6">
            {/* Course title */}
            <div>
                <Link
                    href={course.route}
                    className="text-sm font-semibold hover:text-foreground/80 transition-colors"
                >
                    {course.frontMatter?.title || course.title}
                </Link>
            </div>

            {/* Goals */}
            {goals.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-sm">身につくスキル</h3>
                    </div>
                    <ul className="space-y-2">
                        {goals.map((goal, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <span className="text-foreground/60 mt-0.5">-</span>
                                <span>{goal}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Lesson list */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">レッスン一覧</h3>
                </div>
                <ul className="space-y-1">
                    {course.lessons.map((lesson, index) => (
                        <LessonLink
                            key={lesson.slug}
                            lesson={lesson}
                            index={index}
                            isCurrent={lesson.slug === currentLessonSlug}
                            isCompleted={index < currentIndex}
                        />
                    ))}
                </ul>
            </div>

            {/* Progress */}
            <div className="pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">
                    進捗: {currentIndex + 1} / {course.lessons.length}
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-foreground transition-all"
                        style={{ width: `${((currentIndex + 1) / course.lessons.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

interface LessonLinkProps {
    lesson: LessonItem
    index: number
    isCurrent: boolean
    isCompleted: boolean
}

function LessonLink({ lesson, index, isCurrent, isCompleted }: LessonLinkProps) {
    return (
        <li>
            <Link
                href={lesson.route}
                className={`
                    flex items-center gap-2 px-2 py-1.5 rounded text-sm
                    transition-colors
                    ${isCurrent
                        ? 'bg-secondary font-medium text-foreground'
                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                    }
                `}
            >
                <span className={`
                    flex items-center justify-center w-5 h-5 rounded-full text-xs
                    ${isCompleted
                        ? 'bg-foreground text-background'
                        : isCurrent
                            ? 'bg-foreground/20 text-foreground'
                            : 'bg-border text-muted-foreground'
                    }
                `}>
                    {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                <span className="truncate">{lesson.frontMatter?.title || lesson.title}</span>
            </Link>
        </li>
    )
}
