'use client'

import { DictionaryProvider } from '@/contexts/dictionary-context'
import { type ReactNode, type ReactElement, useMemo } from 'react'

type DictionaryContentItem = {
    slug: string
    term: string
    aliases: string[]
    content: ReactElement
}

type ArticleLayoutClientProps = {
    children: ReactNode
    contents: DictionaryContentItem[]
}

export function ArticleLayoutClient({ children, contents }: ArticleLayoutClientProps) {
    const contentsMap = useMemo(() => {
        const map = new Map<string, { term: string; aliases: string[]; content: ReactElement }>()
        for (const item of contents) {
            map.set(item.slug, {
                term: item.term,
                aliases: item.aliases,
                content: item.content,
            })
        }
        return map
    }, [contents])

    return (
        <DictionaryProvider contents={contentsMap}>
            {children}
        </DictionaryProvider>
    )
}
