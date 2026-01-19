'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronsRight, ChevronRight, Target, BookOpen, Check } from 'lucide-react'
import { HEADER_HEIGHT } from '@/lib/constants'

interface TableOfContentsItem {
    id: string
    text: string
    level: number
}

interface SidebarItem {
    slug: string
    title: string
    route: string
    frontMatter?: {
        title?: string
    }
}

interface ContentSidebarProps {
    /** サイドバーのタイトル（例: "コース内容", "ガイド内容"） */
    title: string
    /** 親コンテンツへのリンク */
    parentRoute: string
    /** 親コンテンツのタイトル */
    parentTitle: string
    /** 子コンテンツ一覧（レッスン or セクション） */
    items: SidebarItem[]
    /** 子コンテンツ一覧のラベル（例: "レッスン一覧", "セクション一覧"） */
    itemsLabel: string
    /** 現在表示中のアイテムのslug */
    currentSlug: string
    /** 現在のインデックス（進捗表示用） */
    currentIndex: number
    /** 目次（現在のアイテムのheadings） */
    headings?: TableOfContentsItem[]
    /** 目標リスト（コース用、オプション） */
    goals?: string[]
}

export function ContentSidebar({
    title,
    parentRoute,
    parentTitle,
    items,
    itemsLabel,
    currentSlug,
    currentIndex,
    headings = [],
    goals = [],
}: ContentSidebarProps) {
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
                        <span className="font-medium text-sm">{title}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </button>
                {isOpen && (
                    <div className="mt-2 p-4 bg-secondary/30 rounded-lg border border-border">
                        <SidebarContent
                            parentRoute={parentRoute}
                            parentTitle={parentTitle}
                            items={items}
                            itemsLabel={itemsLabel}
                            currentSlug={currentSlug}
                            currentIndex={currentIndex}
                            headings={headings}
                            goals={goals}
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
                    aria-label={`${title}を開く`}
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
                        <h2 className="font-bold text-lg">{title}</h2>
                        <ChevronRight className="h-5 w-5 rotate-180" />
                    </button>
                    <div className="p-6">
                        <SidebarContent
                            parentRoute={parentRoute}
                            parentTitle={parentTitle}
                            items={items}
                            itemsLabel={itemsLabel}
                            currentSlug={currentSlug}
                            currentIndex={currentIndex}
                            headings={headings}
                            goals={goals}
                        />
                    </div>
                </div>

            </div>
        </>
    )
}

interface SidebarContentProps {
    parentRoute: string
    parentTitle: string
    items: SidebarItem[]
    itemsLabel: string
    currentSlug: string
    currentIndex: number
    headings: TableOfContentsItem[]
    goals: string[]
}

function SidebarContent({
    parentRoute,
    parentTitle,
    items,
    itemsLabel,
    currentSlug,
    currentIndex,
    headings,
    goals,
}: SidebarContentProps) {
    return (
        <div className="space-y-6">
            {/* Parent title */}
            <div>
                <Link
                    href={parentRoute}
                    className="text-sm font-semibold hover:text-foreground/80 transition-colors"
                >
                    {parentTitle}
                </Link>
            </div>

            {/* Goals (optional) */}
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

            {/* Items list */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">{itemsLabel}</h3>
                </div>
                <ul className="space-y-1">
                    {items.map((item, index) => (
                        <ItemLink
                            key={item.slug}
                            item={item}
                            index={index}
                            isCurrent={item.slug === currentSlug}
                            isCompleted={index < currentIndex}
                            headings={item.slug === currentSlug ? headings : []}
                        />
                    ))}
                </ul>
            </div>

            {/* Progress */}
            <div className="pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">
                    進捗: {currentIndex + 1} / {items.length}
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                        className="h-full bg-foreground transition-all"
                        style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    )
}

interface ItemLinkProps {
    item: SidebarItem
    index: number
    isCurrent: boolean
    isCompleted: boolean
    headings: TableOfContentsItem[]
}

function ItemLink({ item, index, isCurrent, isCompleted, headings }: ItemLinkProps) {
    return (
        <li>
            <Link
                href={item.route}
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
                <span className="truncate">{item.frontMatter?.title || item.title}</span>
            </Link>
            {/* Table of contents for current item */}
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
