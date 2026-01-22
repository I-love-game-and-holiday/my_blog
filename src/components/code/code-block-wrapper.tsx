'use client'

import { forwardRef, type ReactNode, useId } from 'react'
import { cn } from '@/lib/utils'

interface CodeBlockWrapperProps {
    children: ReactNode
    className?: string
}

export function CodeBlockWrapper({ children, className }: CodeBlockWrapperProps) {
    const id = useId()

    return (
        <div
            className={cn('code-block-wrapper my-4 rounded-lg border border-border overflow-hidden', className)}
            data-code-block-id={id}
        >
            {children}
        </div>
    )
}

interface CodeBlockContentProps {
    children: ReactNode
    className?: string
}

export const CodeBlockContent = forwardRef<HTMLDivElement, CodeBlockContentProps>(
    function CodeBlockContent({ children, className }, ref) {
        return (
            <div
                ref={ref}
                className={cn(
                    'code-block-content',
                    '[&>pre]:my-0 [&>pre]:rounded-none [&>pre]:border-0',
                    className
                )}
            >
                {children}
            </div>
        )
    }
)
