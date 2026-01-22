'use client'

import { useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LearnMoreProps {
    children: ReactNode
}

export function LearnMore({ children }: LearnMoreProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="my-4">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-2 px-3 py-2 -ml-3 rounded-md',
                    'text-sm font-medium text-muted-foreground',
                    'hover:text-foreground hover:bg-secondary/70',
                    'transition-colors'
                )}
            >
                {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
                <BookOpen className="h-4 w-4" />
                {isOpen ? '閉じる' : 'もっと詳しく'}
            </button>
            <div
                className={cn(
                    'overflow-hidden transition-all duration-200 ease-in-out',
                    isOpen ? 'mt-2 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <div
                    className={cn(
                        'rounded-lg border border-border',
                        'bg-secondary/50',
                        'p-4 text-sm'
                    )}
                >
                    <div className="prose-sm dark:prose-invert [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}
