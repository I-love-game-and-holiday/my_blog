'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Target, BookOpen, Check } from 'lucide-react'
import { SlidePanel } from './slide-panel'
import { MobileCollapseSection } from './mobile-collapse-section'
import { useCourseProgress } from '@/contexts/course-progress-context'
import { COMPLETED_CIRCLE_BG, PROGRESS_BAR_BG } from '@/lib/constants'
import { CONTENT_SIDEBAR_ATTRIBUTE, CONTENT_SIDEBAR_STORAGE_KEY } from '@/lib/content-sidebar-state'

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
    /** コースslug（learn用。指定時はLocalStorageベースで進捗管理する） */
    courseSlug?: string
}

/**
 * コンテンツサイドバー
 *
 * learn/guides ページで使用するサイドバー。
 * デスクトップ: 左側スライドパネル（初期表示）
 * モバイル: トップバー展開式
 */
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
    courseSlug,
}: ContentSidebarProps) {
    // モバイルの開閉はページごとに初期化する（保存対象はデスクトップのみ）
    const [isMobileOpen, setIsMobileOpen] = useState(true)

    // デスクトップの開閉は <html> のdata属性（CSSが参照）とLocalStorageで管理する
    const handleDesktopOpenChange = (open: boolean) => {
        if (open) {
            document.documentElement.removeAttribute(CONTENT_SIDEBAR_ATTRIBUTE)
        } else {
            document.documentElement.setAttribute(CONTENT_SIDEBAR_ATTRIBUTE, 'closed')
        }
        try {
            localStorage.setItem(CONTENT_SIDEBAR_STORAGE_KEY, String(open))
        } catch {
            // 書き込み失敗時は無視
        }
    }

    const content = (
        <ContentSidebarBody
            parentRoute={parentRoute}
            parentTitle={parentTitle}
            items={items}
            itemsLabel={itemsLabel}
            currentSlug={currentSlug}
            currentIndex={currentIndex}
            headings={headings}
            goals={goals}
            courseSlug={courseSlug}
        />
    )

    return (
        <>
            {/* モバイル */}
            <MobileCollapseSection
                title={title}
                icon={<BookOpen className="h-4 w-4" />}
                isOpen={isMobileOpen}
                onOpenChange={setIsMobileOpen}
            >
                {content}
            </MobileCollapseSection>

            {/* デスクトップ */}
            <SlidePanel
                position="left"
                persistedId="content-sidebar"
                onOpenChange={handleDesktopOpenChange}
                title={title}
            >
                {content}
            </SlidePanel>
        </>
    )
}

// ============================================================
// サブコンポーネント
// ============================================================

interface ContentSidebarBodyProps {
    parentRoute: string
    parentTitle: string
    items: SidebarItem[]
    itemsLabel: string
    currentSlug: string
    currentIndex: number
    headings: TableOfContentsItem[]
    goals: string[]
    courseSlug?: string
}

function ContentSidebarBody({
    parentRoute,
    parentTitle,
    items,
    itemsLabel,
    currentSlug,
    currentIndex,
    headings,
    goals,
    courseSlug,
}: ContentSidebarBodyProps) {
    const { isLessonCompleted, getCompletedCount } = useCourseProgress()

    // courseSlugがある場合はLocalStorageベース、ない場合は従来のインデックスベース
    const completedCount = courseSlug
        ? getCompletedCount(courseSlug)
        : currentIndex + 1

    return (
        <div className="space-y-6">
            {/* 親タイトル */}
            <div>
                <Link
                    href={parentRoute}
                    className="text-sm font-semibold hover:text-foreground/80 transition-colors"
                >
                    {parentTitle}
                </Link>
            </div>

            {/* 目標（オプション） */}
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

            {/* アイテム一覧 */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">{itemsLabel}</h3>
                </div>
                <ul className="space-y-1">
                    {items.map((item, index) => {
                        const completed = courseSlug
                            ? isLessonCompleted(courseSlug, item.slug)
                            : index < currentIndex

                        return (
                            <ItemLink
                                key={item.slug}
                                item={item}
                                index={index}
                                isCurrent={item.slug === currentSlug}
                                isCompleted={completed}
                                headings={item.slug === currentSlug ? headings : []}
                            />
                        )
                    })}
                </ul>
            </div>

            {/* 進捗 */}
            <div className="pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground mb-2">
                    進捗: {completedCount} / {items.length}
                </div>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all ${courseSlug ? PROGRESS_BAR_BG : 'bg-foreground'}`}
                        style={{ width: `${(completedCount / items.length) * 100}%` }}
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
                        ? COMPLETED_CIRCLE_BG
                        : isCurrent
                            ? 'bg-foreground/20 text-foreground'
                            : 'bg-border text-muted-foreground'
                    }
                `}>
                    {isCompleted ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                <span className="truncate">{item.frontMatter?.title || item.title}</span>
            </Link>

            {/* 現在のアイテムの目次 */}
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
