'use client'

import { useMemo, type ReactNode, type ReactElement, Children, isValidElement } from 'react'
import { DictionaryTerm } from './dictionary-term'
import type { DictionaryEntry } from '@/lib/get-dictionary'

type TermMatch = {
    term: string
    slug: string
    index: number
    length: number
}

function createTermMatcher(entries: DictionaryEntry[]) {
    const termMap = new Map<string, string>()

    for (const entry of entries) {
        termMap.set(entry.term.toLowerCase(), entry.slug)
        for (const alias of entry.aliases) {
            termMap.set(alias.toLowerCase(), entry.slug)
        }
    }

    const terms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length)

    return function findTerms(text: string): TermMatch[] {
        const matches: TermMatch[] = []
        const lowerText = text.toLowerCase()
        const usedRanges: [number, number][] = []

        for (const term of terms) {
            let searchIndex = 0
            while (true) {
                const index = lowerText.indexOf(term, searchIndex)
                if (index === -1) break

                const isOverlapping = usedRanges.some(
                    ([start, end]) => index < end && index + term.length > start
                )

                if (!isOverlapping) {
                    matches.push({
                        term: text.slice(index, index + term.length),
                        slug: termMap.get(term)!,
                        index,
                        length: term.length,
                    })
                    usedRanges.push([index, index + term.length])
                }

                searchIndex = index + 1
            }
        }

        return matches.sort((a, b) => a.index - b.index)
    }
}

function processTextWithTerms(
    text: string,
    findTerms: (text: string) => TermMatch[],
    keyPrefix: string
): ReactNode[] {
    const matches = findTerms(text)

    if (matches.length === 0) {
        return [text]
    }

    const result: ReactNode[] = []
    let lastIndex = 0

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i]
        if (match.index > lastIndex) {
            result.push(text.slice(lastIndex, match.index))
        }

        result.push(
            <DictionaryTerm key={`${keyPrefix}-${i}`} slug={match.slug}>
                {match.term}
            </DictionaryTerm>
        )

        lastIndex = match.index + match.length
    }

    if (lastIndex < text.length) {
        result.push(text.slice(lastIndex))
    }

    return result
}

type ElementProps = {
    children?: ReactNode
    [key: string]: unknown
}

function processChildren(
    children: ReactNode,
    findTerms: (text: string) => TermMatch[],
    keyPrefix: string
): ReactNode {
    if (typeof children === 'string') {
        const processed = processTextWithTerms(children, findTerms, keyPrefix)
        return processed.length === 1 ? processed[0] : processed
    }

    if (!isValidElement(children)) {
        return children
    }

    const element = children as ReactElement<ElementProps>

    // Skip processing for certain elements
    const skipTags = ['pre', 'code', 'a', 'button', 'DictionaryTerm']
    if (typeof element.type === 'string' && skipTags.includes(element.type)) {
        return children
    }

    const elementChildren = element.props?.children
    if (!elementChildren) {
        return children
    }

    const processedChildren = Children.map(elementChildren, (child, index) =>
        processChildren(child, findTerms, `${keyPrefix}-${index}`)
    )

    // Clone element with processed children
    const { children: _, ...restProps } = element.props
    return {
        ...element,
        props: {
            ...restProps,
            children: processedChildren,
        },
    }
}

type MdxContentWrapperProps = {
    children: ReactNode
    dictionaryEntries: DictionaryEntry[]
}

export function MdxContentWrapper({ children, dictionaryEntries }: MdxContentWrapperProps) {
    const findTerms = useMemo(
        () => createTermMatcher(dictionaryEntries),
        [dictionaryEntries]
    )

    const processedContent = useMemo(() => {
        return Children.map(children, (child, index) =>
            processChildren(child, findTerms, `mdx-${index}`)
        )
    }, [children, findTerms])

    return <>{processedContent}</>
}
