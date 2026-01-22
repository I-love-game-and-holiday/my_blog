'use client'

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
    INTERACTIVE_HOVER_BG,
    INTERACTIVE_ACTIVE_BG,
    INTERACTIVE_TRANSITION,
} from '@/lib/constants'

interface CodeBlockHeaderProps {
    children: ReactNode
    rightContent?: ReactNode
    onClick?: () => void
    clickable?: boolean
    className?: string
}

export function CodeBlockHeader({
    children,
    rightContent,
    onClick,
    clickable = false,
    className,
}: CodeBlockHeaderProps) {
    return (
        <div
            onClick={clickable ? onClick : undefined}
            className={cn(
                'code-block-header flex items-center justify-between px-4 py-3',
                clickable && [
                    'cursor-pointer',
                    INTERACTIVE_HOVER_BG,
                    INTERACTIVE_ACTIVE_BG,
                    INTERACTIVE_TRANSITION,
                ],
                className
            )}
        >
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                {children}
            </div>
            {rightContent}
        </div>
    )
}
