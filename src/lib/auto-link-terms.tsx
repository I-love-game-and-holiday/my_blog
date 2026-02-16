import { DictionaryTerm } from '@/components/dictionary/dictionary-term'
import type { DictionaryEntry } from '@/lib/get-dictionary'
import { isValidTermBoundary } from '@/lib/term-boundary'

type TermMatch = {
    term: string
    slug: string
    index: number
    length: number
}

export function createTermMatcher(entries: DictionaryEntry[]) {
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

export function processTextWithTerms(
    text: string,
    findTerms: (text: string) => TermMatch[]
): React.ReactNode[] {
    const matches = findTerms(text)

    if (matches.length === 0) {
        return [text]
    }

    const result: React.ReactNode[] = []
    let lastIndex = 0

    for (const match of matches) {
        if (match.index > lastIndex) {
            result.push(text.slice(lastIndex, match.index))
        }

        result.push(
            <DictionaryTerm key={`term-${match.index}`} slug={match.slug}>
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
