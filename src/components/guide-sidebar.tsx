'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronsRight, ChevronRight, BookOpen, Check } from 'lucide-react'
import type { GuideItem, SectionItem } from '@/lib/get-guides'
import { HEADER_HEIGHT } from '@/lib/constants'

interface TableOfContentsItem {
    id: string
    text: string
    level: number
}

interface GuideSidebarProps {
    guide: GuideItem
    currentSectionSlug: string
    currentIndex: number
    headings?: TableOfContentsItem[]
}

export function GuideSidebar({ guide, currentSectionSlug, currentIndex, headings = [] }: GuideSidebarProps) {
    const [isOpen, setIsOpen] = useState(true)

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
                        <span className="font-medium text-sm">ガイド内容</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                    <div className="mt-2 p-4 bg-secondary/30 rounded-lg border border-border">
                        <SidebarContent
                            guide={guide}
                            currentSectionSlug={currentSectionSlug}
                            currentIndex={currentIndex}
                            headings={headings}
                        />
                    </div>
                )}
            </div>

            {/* Desktop: Left edge trigger area */}
            <div className="hidden lg:block">
                {/* Full-height clickable area on left edge */}
                <button
                    onClick={() => setIsOpen(true)}
                    style={{ top: HEADER_HEIGHT }}
                    className={`
                        fixed left-0 h-[calc(100%-56px)] w-12
                        bg-transparent hover:bg-muted-foreground/20
                        transition-colors cursor-pointer z-40
                        ${isOpen ? 'pointer-events-none' : ''}
                    `}
                    aria-label="ガイド内容を開く"
                />

                {/* Open indicator with chevrons */}
                <div
                    style={{ top: HEADER_HEIGHT + 12 }}
                    className={`
                        fixed left-2 z-40
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
                    {/* Close button - full width bar at top */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary transition-colors border-b border-border"
                        aria-label="閉じる"
                    >
                        <h2 className="font-bold text-lg">ガイド内容</h2>
                        <ChevronRight className="h-5 w-5 rotate-180" />
                    </button>
                    <div className="p-6">
                        <SidebarContent
                            guide={guide}
                            currentSectionSlug={currentSectionSlug}
                            currentIndex={currentIndex}
                            headings={headings}
                        />
                    </div>
                </div>

            </div>
        </>
    )
}

interface SidebarContentProps {
    guide: GuideItem
    currentSectionSlug: string
    currentIndex: number
    headings: TableOfContentsItem[]
}

function SidebarContent({ guide, currentSectionSlug, currentIndex, headings }: SidebarContentProps) {
    return (
        <div className="space-y-6">
            {/* Guide title */}
            <div>
                <Link
                    href={guide.route}
                    className="text-sm font-semibold hover:text-foreground/80 transition-colors"
                >
                    {guide.frontMatter?.title || guide.title}
                </Link>
            </div>

            {/* Section list */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">セクション一覧</h3>
                </div>
                <ul className="space-y-1">
                    {guide.sections.map((section, index) => (
                        <SectionLink
                            key={section.slug}
                            section={section}
                            index={index}
                            isCurrent={section.slug === currentSectionSlug}
                            isCompleted={index < currentIndex}
                            headings={section.slug === currentSectionSlug ? headings : []}
                        />
                    ))}
                </ul>
            </div>

            {/* Progress */}
            <div className="pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">
                    進捗: {currentIndex + 1} / {guide.sections.length}
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-foreground transition-all"
                        style={{ width: `${((currentIndex + 1) / guide.sections.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

interface SectionLinkProps {
    section: SectionItem
    index: number
    isCurrent: boolean
    isCompleted: boolean
    headings: TableOfContentsItem[]
}

function SectionLink({ section, index, isCurrent, isCompleted, headings }: SectionLinkProps) {
    return (
        <li>
            <Link
                href={section.route}
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
                <span className="truncate">{section.frontMatter?.title || section.title}</span>
            </Link>
            {/* Table of contents for current section */}
            {isCurrent && headings.length > 0 && (
                <ul className="ml-7 mt-1 space-y-0.5 border-l border-border pl-2">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                className={`
                                    block text-xs text-muted-foreground hover:text-foreground
                                    transition-colors py-0.5
                                    ${heading.level === 3 ? 'pl-3' : ''}
                                    ${heading.level === 4 ? 'pl-6' : ''}
                                `}
                            >
                                {heading.text}
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </li>
    )
}
