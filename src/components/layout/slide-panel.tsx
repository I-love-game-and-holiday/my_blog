'use client'

import { type ReactNode } from 'react'
import { ChevronsRight, ChevronsLeft } from 'lucide-react'
import { HEADER_HEIGHT } from '@/lib/constants'

type PanelPosition = 'left' | 'right'

interface SlidePanelProps {
    /** パネルの位置 */
    position: PanelPosition
    /** 開閉状態 */
    isOpen: boolean
    /** 開閉状態の変更ハンドラ */
    onOpenChange: (isOpen: boolean) => void
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
    isOpen,
    onOpenChange,
    title,
    children,
    width = 'w-80',
}: SlidePanelProps) {
    const isLeft = position === 'left'

    const edgePosition = isLeft ? 'left-0' : 'right-0'
    const indicatorPosition = isLeft ? 'left-2' : 'right-2'
    const panelBorder = isLeft ? 'border-r' : 'border-l'
    const panelTransform = isLeft
        ? (isOpen ? 'translate-x-0' : '-translate-x-full')
        : (isOpen ? 'translate-x-0' : 'translate-x-full')

    const IndicatorIcon = isLeft ? ChevronsRight : ChevronsLeft
    const CloseIcon = isLeft ? ChevronsRight : ChevronsLeft

    return (
        <div className="hidden lg:block">
            {/* エッジトリガーエリア */}
            <button
                onClick={() => onOpenChange(true)}
                style={{ top: HEADER_HEIGHT }}
                className={`
                    fixed ${edgePosition} h-[calc(100%-56px)] w-12
                    bg-transparent hover:bg-muted-foreground/20
                    transition-colors cursor-pointer z-40
                    ${isOpen ? 'pointer-events-none' : ''}
                `}
                aria-label={`${title}を開く`}
            />

            {/* 開くインジケーター */}
            <div
                style={{ top: HEADER_HEIGHT + 12 }}
                className={`
                    fixed ${indicatorPosition} z-40
                    pointer-events-none transition-opacity
                    ${isOpen ? 'opacity-0' : 'opacity-100'}
                `}
            >
                <IndicatorIcon className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* スライドパネル */}
            <div
                style={{ top: HEADER_HEIGHT }}
                className={`
                    fixed ${edgePosition} ${panelBorder} h-[calc(100%-56px)] ${width} z-50
                    bg-background border-border shadow-xl
                    transform transition-transform duration-300 ease-in-out
                    ${panelTransform}
                    overflow-y-auto
                `}
            >
                {/* ヘッダー（閉じるボタン） */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="w-full flex items-center justify-between px-6 py-4
                        hover:bg-secondary transition-colors border-b border-border"
                    aria-label="閉じる"
                >
                    <h2 className="font-bold text-lg">{title}</h2>
                    <CloseIcon className={`h-5 w-5 ${isLeft ? 'rotate-180' : ''}`} />
                </button>

                {/* コンテンツ */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}
