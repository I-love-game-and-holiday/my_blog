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
}: ClickableCardProps) {
    return (
        <Link
            href={href}
            className={cn(
                'group flex items-center gap-4 p-4 border border-border rounded-lg',
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
