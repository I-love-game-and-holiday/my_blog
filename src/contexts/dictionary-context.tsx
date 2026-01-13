'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type DictionaryContextValue = {
    selectedTerm: string | null
    isOpen: boolean
    openDictionary: (slug: string) => void
    closeDictionary: () => void
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null)

type DictionaryProviderProps = {
    children: ReactNode
}

export function DictionaryProvider({ children }: DictionaryProviderProps) {
    const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)

    const openDictionary = useCallback((slug: string) => {
        setSelectedTerm(slug)
        setIsOpen(true)
    }, [])

    const closeDictionary = useCallback(() => {
        setIsOpen(false)
    }, [])

    return (
        <DictionaryContext.Provider value={{ selectedTerm, isOpen, openDictionary, closeDictionary }}>
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
