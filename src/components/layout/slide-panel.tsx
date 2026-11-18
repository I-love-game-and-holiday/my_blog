'use client'

import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
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
 * 背景を覆わない（ページ本体は操作できたまま）ため、モーダルではなく補足領域（aside）として扱う。
 * 閉じている間は visibility: hidden（globals.css の `.slide-panel`）でフォーカス・読み上げの対象から外す。
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
    const titleId = useId()
    const triggerRef = useRef<HTMLButtonElement>(null)
    const closeButtonRef = useRef<HTMLButtonElement>(null)

    const isLeft = position === 'left'
    const isPersisted = persistedId !== undefined

    const edgePosition = isLeft ? 'left-0' : 'right-0'
    const indicatorPosition = isLeft ? 'left-2' : 'right-2'
    const panelBorder = isLeft ? 'border-r' : 'border-l'
    const closedTranslate = isLeft ? '-translate-x-full' : 'translate-x-full'
    const panelTransform = isPersisted ? '' : (isOpen ? 'translate-x-0' : closedTranslate)
    // persistedId 指定時は data-state を付けず、<html> のdata属性からCSSが決める
    const panelState = isPersisted ? undefined : (isOpen ? 'open' : 'closed')
    const triggerVisibility = !isPersisted && isOpen ? 'invisible' : ''
    const indicatorOpacity = isPersisted ? '' : (isOpen ? 'opacity-0' : 'opacity-100')

    const IndicatorIcon = isLeft ? ChevronsRight : ChevronsLeft
    const CloseIcon = isLeft ? ChevronsRight : ChevronsLeft

    // 開閉の見た目が切り替わった後（次のフレーム）にフォーカスを移す。
    // 見えていない要素にはフォーカスできないため、描画の反映を待つ
    const focusAfterToggle = (target: HTMLElement | null) => {
        requestAnimationFrame(() => target?.focus())
    }

    const handleOpen = () => {
        onOpenChange(true)
        focusAfterToggle(closeButtonRef.current)
    }

    const handleClose = () => {
        onOpenChange(false)
        focusAfterToggle(triggerRef.current)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape') {
            handleClose()
        }
    }

    return (
        <div className="hidden lg:block">
            {/* エッジトリガーエリア */}
            <button
                ref={triggerRef}
                type="button"
                onClick={handleOpen}
                style={{ top: 'var(--header-height)' }}
                data-slide-panel={persistedId}
                data-part="trigger"
                className={`
                    fixed ${edgePosition} h-[calc(100%-var(--header-height))] w-12
                    bg-transparent hover:bg-muted-foreground/20 focus-visible:bg-muted-foreground/20
                    transition-colors cursor-pointer z-(--z-panel-trigger)
                    ${triggerVisibility}
                `}
                aria-label={`${title}を開く`}
            />

            {/* 開くインジケーター */}
            <div
                aria-hidden="true"
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
            <aside
                aria-labelledby={titleId}
                onKeyDown={handleKeyDown}
                style={{ top: 'var(--header-height)' }}
                data-slide-panel={persistedId}
                data-part="panel"
                data-state={panelState}
                className={`
                    slide-panel
                    fixed ${edgePosition} ${panelBorder} h-[calc(100%-var(--header-height))] ${width} z-(--z-panel)
                    bg-background border-border shadow-xl
                    ${panelTransform}
                    flex flex-col
                `}
            >
                {/* ヘッダー（タイトルと閉じるボタン） - スティッキー */}
                <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-border bg-background">
                    <h2 id={titleId} className="font-bold text-lg">{title}</h2>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={handleClose}
                        className="p-1 rounded-md hover:bg-secondary transition-colors"
                        aria-label={`${title}を閉じる`}
                    >
                        <CloseIcon className={`h-5 w-5 ${isLeft ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* コンテンツ - スクロール可能 */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </aside>
        </div>
    )
}
