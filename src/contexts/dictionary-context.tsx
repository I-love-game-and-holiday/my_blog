'use client'

import { createContext, useContext, useState, useCallback, type ReactNode, type ReactElement } from 'react'

type DictionaryContent = {
    term: string
    aliases: string[]
    content: ReactElement
}

type DictionaryContextValue = {
    selectedTerm: string | null
    isOpen: boolean
    openDictionary: (slug: string) => void
    closeDictionary: () => void
    getContent: (slug: string) => DictionaryContent | undefined
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null)

type DictionaryProviderProps = {
    children: ReactNode
    contents: Map<string, DictionaryContent>
}

export function DictionaryProvider({ children, contents }: DictionaryProviderProps) {
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const openDictionary = useCallback((slug: string) => {
        setSelectedTerm(slug)
        setIsOpen(true)
    }, [])

    const closeDictionary = useCallback(() => {
        setIsOpen(false)
    }, [])

    const getContent = useCallback((slug: string) => {
        return contents.get(slug)
    }, [contents])

    return (
        <DictionaryContext.Provider value={{ selectedTerm, isOpen, openDictionary, closeDictionary, getContent }}>
            {children}
        </DictionaryContext.Provider>
    )
}

export function useDictionary() {
    const context = useContext(DictionaryContext)
    if (!context) {
        throw new Error('useDictionary must be used within a DictionaryProvider')
    }
    return context
}
