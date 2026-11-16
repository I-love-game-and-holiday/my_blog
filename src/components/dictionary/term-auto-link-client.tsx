'use client'

import { useMemo, type ReactNode, type ReactElement, Children, isValidElement } from 'react'
import { DictionaryTerm } from './dictionary-term'
import type { DictionaryEntry } from '@/lib/get-dictionary'
import { isValidTermBoundary } from '@/lib/term-boundary'

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

                if (!isOverlapping && isValidTermBoundary(text, index, term.length, term)) {
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

    // コード・リンク・ボタンの中や、すでに用語リンクになっている箇所には用語リンクを付けない
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

    // 子要素を処理済みのものに差し替えた要素を作る（children 以外のpropsはそのまま引き継ぐ）
    return {
        ...element,
        props: {
            ...element.props,
            children: processedChildren,
        },
    }
}

type TermAutoLinkProps = {
    children: ReactNode
    dictionaryEntries: DictionaryEntry[]
}

/**
 * 記事本文の中に出てくる辞書用語を探し、自動で用語リンク（DictionaryTerm）に置き換える
 *
 * 用語はページ表示時（クライアント側）に、React要素のツリーをたどって文字列部分から探す。
 * learn / guides の記事ページで、コンパイル済みのMDX本文を包んで使う。
 */
export function TermAutoLink({ children, dictionaryEntries }: TermAutoLinkProps) {
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
