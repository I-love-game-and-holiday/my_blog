'use client'

import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
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

/** シート内でTabキーの移動先になる要素 */
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * モバイル用ボトムシート
 *
 * 画面下部からスライドインするモーダル。
 * 辞書の用語クリック時などに使用。
 * 開いている間はフォーカスをシート内に閉じ込め、Escキーで閉じる。閉じたら開く前の要素にフォーカスを戻す。
 */
export function MobileBottomSheet({
    isOpen,
    onClose,
    title,
    icon,
    children,
}: MobileBottomSheetProps) {
    const titleId = useId()
    const sheetRef = useRef<HTMLDivElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    // 開いたら閉じるボタンにフォーカスを移し、閉じたら元の要素に戻す
    useEffect(() => {
        if (!isOpen) return

        const previouslyFocused = document.activeElement as HTMLElement | null
        closeButtonRef.current?.focus()

        return () => {
            previouslyFocused?.focus()
        }
    }, [isOpen])

    if (!isOpen) {
        return null
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            event.stopPropagation()
            onClose()
            return
        }
        if (event.key !== 'Tab' || !sheetRef.current) return

        // 先頭と末尾でフォーカスを折り返し、シートの外へ出さない
        const focusables = sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (!first || !last) return

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }

    return (
        <div className="lg:hidden fixed inset-0 z-(--z-overlay)">
            {/* バックドロップ（マウス・タッチ用。キーボードではEscと閉じるボタンで閉じる） */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* シート本体 */}
            <div
                ref={sheetRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onKeyDown={handleKeyDown}
                className="absolute bottom-0 left-0 right-0 bg-background rounded-t-xl max-h-[70vh] overflow-y-auto"
            >
                {/* ヘッダー */}
                <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                    <h2 id={titleId} className="text-lg font-semibold flex items-center gap-2">
                        {icon}
                        {title}
                    </h2>
                    <button
                        ref={closeButtonRef}
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
