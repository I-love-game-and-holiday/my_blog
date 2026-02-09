import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
    INTERACTIVE_HOVER_BG,
    INTERACTIVE_ACTIVE_BG,
    INTERACTIVE_TRANSITION,
} from '@/lib/constants'

interface ClickableCardProps {
    href: string
    children: React.ReactNode
    className?: string
    /** デフォルトのカードスタイル（border, rounded-lg）を適用するか */
    variant?: 'default' | 'plain'
    /** デフォルトのパディング（p-4）を適用するか */
    padding?: 'default' | 'none'
    /** ボーダー色の上書き（Tailwind クラス名） */
    borderColor?: string
}

/**
 * クリック可能なカードコンポーネント
 *
 * ホバー時に薄いグレー背景、クリック時にやや濃いグレー背景を表示する
 * アプリ全体で共通のインタラクティブスタイルを適用
 */
export function ClickableCard({
    href,
    children,
    className,
    variant = 'default',
    padding = 'default',
    borderColor,
}: ClickableCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                'group block rounded-lg',
                variant === 'default' && (borderColor ? `border ${borderColor}` : 'border border-border'),
                padding === 'default' && 'p-4',
                INTERACTIVE_HOVER_BG,
                INTERACTIVE_ACTIVE_BG,
                INTERACTIVE_TRANSITION,
                className
            )}
        >
            {children}
        </Link>
    )
}
