'use client'

import { DictionaryPanel } from '@/components/dictionary/dictionary-panel'
import { type ReactNode } from 'react'

type ArticleLayoutProps = {
    children: ReactNode
}

export function ArticleLayout({ children }: ArticleLayoutProps) {
    return (
        <div className="article-layout">
            <div className="article-content">
                {children}
            </div>
            <DictionaryPanel />
        </div>
    )
}
