'use client'

import { useRef, type ReactNode } from 'react'
import { CodeBlockWrapper, CodeBlockContent } from './code-block-wrapper'
import { CopyButton } from './copy-button'

interface CopyableCodeProps {
    children: ReactNode
}

export function CopyableCode({ children }: CopyableCodeProps) {
    const contentRef = useRef<HTMLDivElement>(null)

    const getCodeText = () => {
        const codeElement = contentRef.current?.querySelector('pre code')
        return codeElement?.textContent || ''
    }

    return (
        <CodeBlockWrapper>
            <div className="relative">
                <div className="absolute top-1 right-1 z-(--z-base)">
                    <CopyButton getText={getCodeText} />
                </div>
                <CodeBlockContent ref={contentRef}>{children}</CodeBlockContent>
            </div>
        </CodeBlockWrapper>
    )
}
