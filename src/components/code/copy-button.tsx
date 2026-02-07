'use client'

import { useState, type MouseEvent } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { INTERACTIVE_TRANSITION } from '@/lib/constants'

interface CopyButtonProps {
    getText: () => string
    className?: string
}

export function CopyButton({ getText, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = (e: MouseEvent) => {
        e.stopPropagation()
        const text = getText()
        if (!text) return

        const handler = (ev: ClipboardEvent) => {
            ev.preventDefault()
            ev.clipboardData?.setData('text/plain', text)
        }

        document.addEventListener('copy', handler)
        document.execCommand('copy')
        document.removeEventListener('copy', handler)

        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className={cn(
                'flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md',
                'text-muted-foreground hover:text-foreground hover:bg-background/80',
                INTERACTIVE_TRANSITION,
                className
            )}
            title="コードをコピー"
        >
            {copied ? (
                <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">コピー済み</span>
                </>
            ) : (
                <>
                    <Copy className="h-4 w-4" />
                    <span>コピー</span>
                </>
            )}
        </button>
    )
}
