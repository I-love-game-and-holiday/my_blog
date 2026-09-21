'use client'

import { type ReactNode } from 'react'
import { ChevronsRight, ChevronsLeft } from 'lucide-react'

type PanelPosition = 'left' | 'right'

interface SlidePanelProps {
    /** パネルの位置 */
    position: PanelPosition
    /** 開閉状態（persistedId 指定時は見た目に使われない） */
    isOpen?: boolean
    /** 開閉状態の変更ハンドラ */
    onOpenChange: (isOpen: boolean) => void
    /**
     * 開閉の見た目を <html> のdata属性とCSS（globals.css）で決める場合の識別子。
     * 静的生成ページで、再訪時にアニメーションなしで前回の状態を復元するために使う
     */
    persistedId?: string
    /** パネルのタイトル */
    title: string
    /** パネルのコンテンツ */
    children: ReactNode
    /** パネルの幅（Tailwind CSS クラス） */
    width?: string
}

/**
 * デスクトップ用スライドパネル
 *
 * 画面端からスライドインするパネルコンポーネント。
 * モバイル表示は含まないため、別途モバイル用コンポーネントと組み合わせて使用する。
 */
export function SlidePanel({
    position,
    isOpen = true,
    onOpenChange,
    persistedId,
    title,
    children,
    width = 'w-80',
}: SlidePanelProps) {
    const isLeft = position === 'left'
    const isPersisted = persistedId !== undefined

    const edgePosition = isLeft ? 'left-0' : 'right-0'
    const indicatorPosition = isLeft ? 'left-2' : 'right-2'
    const panelBorder = isLeft ? 'border-r' : 'border-l'
    const closedTranslate = isLeft ? '-translate-x-full' : 'translate-x-full'
    const panelTransform = isPersisted ? '' : (isOpen ? 'translate-x-0' : closedTranslate)
    const triggerPointer = !isPersisted && isOpen ? 'pointer-events-none' : ''
    const indicatorOpacity = isPersisted ? '' : (isOpen ? 'opacity-0' : 'opacity-100')

    const IndicatorIcon = isLeft ? ChevronsRight : ChevronsLeft
    const CloseIcon = isLeft ? ChevronsRight : ChevronsLeft

    return (
        <div className="hidden lg:block">
            {/* エッジトリガーエリア */}
            <button
                onClick={() => onOpenChange(true)}
                style={{ top: 'var(--header-height)' }}
                data-slide-panel={persistedId}
                data-part="trigger"
                className={`
                    fixed ${edgePosition} h-[calc(100%-var(--header-height))] w-12
                    bg-transparent hover:bg-muted-foreground/20
                    transition-colors cursor-pointer z-(--z-panel-trigger)
                    ${triggerPointer}
                `}
                aria-label={`${title}を開く`}
            />

            {/* 開くインジケーター */}
            <div
                style={{ top: 'calc(var(--header-height) + 0.75rem)' }}
                data-slide-panel={persistedId}
                data-part="indicator"
                className={`
                    fixed ${indicatorPosition} z-(--z-panel-trigger)
                    pointer-events-none transition-opacity
                    ${indicatorOpacity}
                `}
            >
                <IndicatorIcon className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* スライドパネル */}
            <div
                style={{ top: 'var(--header-height)' }}
                data-slide-panel={persistedId}
                data-part="panel"
                className={`
                    fixed ${edgePosition} ${panelBorder} h-[calc(100%-var(--header-height))] ${width} z-(--z-panel)
                    bg-background border-border shadow-xl
                    transform transition-transform duration-300 ease-in-out
                    ${panelTransform}
                    flex flex-col
                `}
            >
                {/* ヘッダー（閉じるボタン） - スティッキー */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="shrink-0 w-full flex items-center justify-between px-6 py-4
                        hover:bg-secondary transition-colors border-b border-border bg-background"
                    aria-label="閉じる"
                >
                    <h2 className="font-bold text-lg">{title}</h2>
                    <CloseIcon className={`h-5 w-5 ${isLeft ? 'rotate-180' : ''}`} />
                </button>

                {/* コンテンツ - スクロール可能 */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
