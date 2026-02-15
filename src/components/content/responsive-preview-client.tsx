'use client'

import { useState, useMemo, useCallback } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { INTERACTIVE_TRANSITION } from '@/lib/constants'

interface ResponsivePreviewClientProps {
    html: string
    css: string
    title?: string
    height?: number
    minWidth?: number
    maxWidth?: number
    defaultWidth?: number
    /** ブレークポイントを示すマーカー（px値の配列） */
    markers?: number[]
}

/** スライダーのステップ幅（px） */
const SLIDER_STEP = 1

/** プリセットボタンの定義 */
const PRESETS = [
    { label: 'スマホ', width: 375, icon: Smartphone },
    { label: 'PC', width: 1280, icon: Monitor },
] as const

export function ResponsivePreviewClient({
    html,
    css,
    title,
    height = 200,
    minWidth = 320,
    maxWidth = 1280,
    defaultWidth,
    markers = [],
}: ResponsivePreviewClientProps) {
    const initialWidth = defaultWidth ?? Math.round((minWidth + maxWidth) / 2)
    const [width, setWidth] = useState(initialWidth)

    const handleSliderChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setWidth(Number(event.target.value))
        },
        []
    )

    const handlePreset = useCallback((presetWidth: number) => {
        setWidth(presetWidth)
    }, [])

    const srcDoc = useMemo(() => {
        return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <style>html,body{overflow:hidden}${css}</style>
</head>
<body>
    ${html}
</body>
</html>`.trim()
    }, [html, css])

    /** マーカーのスライダー上の位置（%） */
    const markerPositions = useMemo(() => {
        return markers.map((px) => ({
            px,
            percent: ((px - minWidth) / (maxWidth - minWidth)) * 100,
        }))
    }, [markers, minWidth, maxWidth])

    return (
        <figure className="my-6">
            {title && (
                <figcaption className="mb-2 text-sm font-medium text-muted-foreground">
                    {title}
                </figcaption>
            )}
            <div className="rounded-lg border border-border overflow-hidden">
                {/* コントロールバー */}
                <div className="flex items-center gap-3 border-b border-border bg-muted/30 px-4 py-2.5">
                    {/* プリセットボタン */}
                    <div className="flex items-center gap-1.5">
                        {PRESETS.map((preset) => {
                            const Icon = preset.icon
                            const isActive = width === preset.width
                            return (
                                <button
                                    key={preset.label}
                                    onClick={() => handlePreset(preset.width)}
                                    className={cn(
                                        'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium',
                                        INTERACTIVE_TRANSITION,
                                        isActive
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    )}
                                    title={`${preset.label}（${preset.width}px）`}
                                >
                                    <Icon className="size-3.5" />
                                    {preset.label}
                                </button>
                            )
                        })}
                    </div>

                    {/* スライダー */}
                    <div className="relative flex-1">
                        <input
                            type="range"
                            min={minWidth}
                            max={maxWidth}
                            step={SLIDER_STEP}
                            value={width}
                            onChange={handleSliderChange}
                            className="responsive-preview-slider w-full"
                            aria-label="プレビュー幅"
                        />
                        {/* ブレークポイントマーカー */}
                        {markerPositions.map((marker) => (
                            <div
                                key={marker.px}
                                className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ left: `${marker.percent}%` }}
                            >
                                <div className="w-0.5 h-3 bg-primary/60 rounded-full" />
                            </div>
                        ))}
                    </div>

                    {/* 幅表示 */}
                    <span className="min-w-[5rem] text-right font-mono text-sm tabular-nums text-foreground">
                        {width}px
                    </span>
                </div>

                {/* プレビュー領域 */}
                <div
                    className="flex justify-center bg-muted/20 px-4 py-4"
                    style={{ minHeight: height + 32 }}
                >
                    <div
                        className="overflow-hidden rounded border border-border bg-white shadow-sm"
                        style={{
                            width,
                            maxWidth: '100%',
                            height,
                            transition: 'width 0.15s ease-out',
                        }}
                    >
                        <iframe
                            srcDoc={srcDoc}
                            className="h-full w-full"
                            sandbox="allow-scripts"
                            scrolling="no"
                            title={title || 'レスポンシブプレビュー'}
                            style={{ pointerEvents: 'none', overflow: 'hidden' }}
                        />
                    </div>
                </div>
            </div>
        </figure>
    )
}
