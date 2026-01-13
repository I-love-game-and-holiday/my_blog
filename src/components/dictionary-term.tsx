'use client'

import { useDictionary } from '@/contexts/dictionary-context'
import { cn } from '@/lib/utils'

type DictionaryTermProps = {
    slug: string
    children: React.ReactNode
    className?: string
}

export function DictionaryTerm({ slug, children, className }: DictionaryTermProps) {
    const { openDictionary, selectedTerm } = useDictionary()

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        openDictionary(slug)
    }

    const isSelected = selectedTerm === slug

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                'dictionary-term',
                isSelected && 'dictionary-term-active',
                className
            )}
        >
            {children}
        </button>
    )
}
