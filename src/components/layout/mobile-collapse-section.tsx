'use client'

import { type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

interface MobileCollapseSectionProps {
    /** セクションのタイトル */
    title: string
    /** タイトル横に表示するアイコン */
    icon: ReactNode
    /** 開閉状態 */
    isOpen: boolean
    /** 開閉状態の変更ハンドラ */
    onOpenChange: (isOpen: boolean) => void
    /** セクションのコンテンツ */
    children: ReactNode
}

/**
 * モバイル用折りたたみセクション
 *
 * トップバー形式で展開/折りたたみできるセクション。
 * ContentSidebarのモバイル表示などに使用。
 */
export function MobileCollapseSection({
    title,
    icon,
    isOpen,
    onOpenChange,
    children,
}: MobileCollapseSectionProps) {
    return (
        <div className="lg:hidden mb-6">
            <button
                onClick={() => onOpenChange(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-secondary/50 rounded-lg border border-border"
            >
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-medium text-sm">{title}</span>
                </div>
                <ChevronRight
                    className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                />
            </button>
            {isOpen && (
                <div className="mt-2 p-4 bg-secondary/30 rounded-lg border border-border">
                    {children}
                </div>
            )}
        </div>
    )
}
