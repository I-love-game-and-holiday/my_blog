'use client'

import { type ReactNode } from 'react'
import { X } from 'lucide-react'

interface MobileBottomSheetProps {
    /** 開閉状態 */
    isOpen: boolean
    /** 閉じるハンドラ */
    onClose: () => void
    /** シートのタイトル */
    title: string
    /** タイトル横に表示するアイコン */
    icon?: ReactNode
    /** シートのコンテンツ */
    children: ReactNode
}

/**
 * モバイル用ボトムシート
 *
 * 画面下部からスライドインするモーダル。
 * 辞書の用語クリック時などに使用。
 */
export function MobileBottomSheet({
    isOpen,
    onClose,
    title,
    icon,
    children,
}: MobileBottomSheetProps) {
    if (!isOpen) {
        return null
    }

    return (
        <div className="lg:hidden fixed inset-0 z-50">
            {/* バックドロップ */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* シート本体 */}
            <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl max-h-[70vh] overflow-y-auto">
                {/* ヘッダー */}
                <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        {icon}
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-md transition-colors"
                        aria-label="閉じる"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* コンテンツ */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    )
}
