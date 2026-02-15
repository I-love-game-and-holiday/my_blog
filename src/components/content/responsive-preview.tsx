import { ResponsivePreviewClient } from './responsive-preview-client'

interface ResponsivePreviewProps {
    html: string
    css?: string
    title?: string
    height?: number
    minWidth?: number
    maxWidth?: number
    defaultWidth?: number
    /** ブレークポイントを示すマーカー（px値の配列） */
    markers?: number[]
}

export function ResponsivePreview({
    html,
    css = '',
    title,
    height = 200,
    minWidth = 320,
    maxWidth = 1280,
    defaultWidth,
    markers = [],
}: ResponsivePreviewProps) {
    return (
        <ResponsivePreviewClient
            html={html}
            css={css}
            title={title}
            height={height}
            minWidth={minWidth}
            maxWidth={maxWidth}
            defaultWidth={defaultWidth}
            markers={markers}
        />
    )
}
