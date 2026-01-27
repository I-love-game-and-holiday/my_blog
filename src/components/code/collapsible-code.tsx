'use client'

import { useState, useRef, type ReactNode } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CodeBlockWrapper, CodeBlockContent } from './code-block-wrapper'
import { CodeBlockHeader } from './code-block-header'
import { CopyButton } from './copy-button'

interface CollapsibleCodeProps {
    children: ReactNode
    title?: string
    defaultOpen?: boolean
}

export function CollapsibleCode({
    children,
    title = 'コード',
    defaultOpen = false,
}: CollapsibleCodeProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)
    const contentRef = useRef<HTMLDivElement>(null)

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    const getCodeText = () => {
        const codeElement = contentRef.current?.querySelector('pre code')
        return codeElement?.textContent || ''
    }

    return (
        <CodeBlockWrapper>
            <CodeBlockHeader
                onClick={handleToggle}
                clickable
                rightContent={<CopyButton getText={getCodeText} />}
            >
                {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
                {title}
            </CodeBlockHeader>
            <div
                className={cn(
                    'transition-all duration-200 ease-in-out overflow-hidden',
                    isOpen ? 'opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <CodeBlockContent ref={contentRef}>{children}</CodeBlockContent>
            </div>
        </CodeBlockWrapper>
    )
}
