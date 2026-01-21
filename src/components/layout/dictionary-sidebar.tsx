'use client'

import { BookMarked, BookOpen, X } from 'lucide-react'
import { SlidePanel } from './slide-panel'
import { MobileBottomSheet } from './mobile-bottom-sheet'
import { useDictionary } from '@/contexts/dictionary-context'
import type { DictionaryEntry } from '@/lib/get-dictionary'

interface DictionarySidebarProps {
    /** ページ内で使用されている辞書用語 */
    pageTerms: DictionaryEntry[]
}

/**
 * 辞書サイドバー
 *
 * learn/guides/blog ページで使用する辞書サイドバー。
 * デスクトップ: 右側スライドパネル（初期非表示）
 * モバイル: 用語クリック時にボトムシート表示
 */
export function DictionarySidebar({ pageTerms }: DictionarySidebarProps) {
    const { selectedTerm, isOpen: isPanelOpen, openDictionary, closeDictionary, getContent } = useDictionary()

    const content = selectedTerm ? getContent(selectedTerm) : undefined

    // 用語がない場合は何も表示しない
    if (pageTerms.length === 0) {
        return null
    }

    const handleTermClick = (slug: string) => {
        if (selectedTerm === slug && isPanelOpen) {
            closeDictionary()
        } else {
            openDictionary(slug)
        }
    }

    const handlePanelOpenChange = (open: boolean) => {
        if (open) {
            // パネルを開く際、最初の用語を選択
            const termToOpen = pageTerms[0]?.slug
            if (termToOpen) {
                openDictionary(termToOpen)
            }
        } else {
            closeDictionary()
        }
    }

    return (
        <>
            {/* モバイル: ボトムシート（用語クリック時のみ表示） */}
            <MobileBottomSheet
                isOpen={isPanelOpen}
                onClose={closeDictionary}
                title={content?.term || '読み込み中...'}
                icon={<BookOpen className="w-5 h-5" />}
            >
                {content ? (
                    <div className="prose prose-sm">
                        {content.content}
                    </div>
                ) : (
                    <LoadingSkeleton />
                )}
            </MobileBottomSheet>

            {/* デスクトップ: 右側スライドパネル */}
            <SlidePanel
                position="right"
                isOpen={isPanelOpen}
                onOpenChange={handlePanelOpenChange}
                title="辞書"
                width="lg:w-80 xl:w-96 2xl:w-120"
            >
                <DictionarySidebarBody
                    pageTerms={pageTerms}
                    selectedTerm={selectedTerm}
                    isPanelOpen={isPanelOpen}
                    content={content}
                    onTermClick={handleTermClick}
                    onClose={closeDictionary}
                />
            </SlidePanel>
        </>
    )
}

// ============================================================
// サブコンポーネント
// ============================================================

interface DictionarySidebarBodyProps {
    pageTerms: DictionaryEntry[]
    selectedTerm: string | null
    isPanelOpen: boolean
    content: { term: string; aliases: string[]; content: React.ReactElement } | undefined
    onTermClick: (slug: string) => void
    onClose: () => void
}

function DictionarySidebarBody({
    pageTerms,
    selectedTerm,
    isPanelOpen,
    content,
    onTermClick,
    onClose,
}: DictionarySidebarBodyProps) {
    return (
        <div className="space-y-6">
            {/* 用語一覧 */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <BookMarked className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">
                        このページの用語 ({pageTerms.length})
                    </h3>
                </div>
                <ul className="space-y-1">
                    {pageTerms.map((entry) => (
                        <li key={entry.slug}>
                            <button
                                onClick={() => onTermClick(entry.slug)}
                                className={`
                                    w-full text-left px-2 py-1.5 rounded text-sm
                                    transition-colors
                                    ${selectedTerm === entry.slug && isPanelOpen
                                        ? 'bg-secondary font-medium text-foreground'
                                        : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
                                    }
                                `}
                            >
                                {entry.term}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 選択中の用語の内容 */}
            {isPanelOpen && (
                <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <h3 className="font-semibold text-sm">
                                {content?.term || '読み込み中...'}
                            </h3>
                        </div>
                    </div>
                    {content ? (
                        <div className="prose prose-sm text-sm">
                            {content.content}
                        </div>
                    ) : (
                        <LoadingSkeleton />
                    )}
                </div>
            )}
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-2/3" />
        </div>
    )
}
