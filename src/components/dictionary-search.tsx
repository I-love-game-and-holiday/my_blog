'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { DictionaryEntry } from '@/lib/get-dictionary'

type DictionarySearchProps = {
    entries: DictionaryEntry[]
}

export function DictionarySearch({ entries }: DictionarySearchProps) {
    const [query, setQuery] = useState('')

    const filteredEntries = useMemo(() => {
        if (!query.trim()) {
            return entries
        }

        const lowerQuery = query.toLowerCase().trim()

        return entries.filter(entry => {
            // termでマッチ
            if (entry.term.toLowerCase().includes(lowerQuery)) {
                return true
            }
            // aliasesでマッチ
            return entry.aliases.some(alias =>
                alias.toLowerCase().includes(lowerQuery)
            )
        })
    }, [entries, query])

    // Group entries by first character
    const groupedEntries = useMemo(() => {
        return filteredEntries.reduce((acc, entry) => {
            const firstChar = entry.term.charAt(0).toUpperCase()
            if (!acc[firstChar]) {
                acc[firstChar] = []
            }
            acc[firstChar].push(entry)
            return acc
        }, {} as Record<string, DictionaryEntry[]>)
    }, [filteredEntries])

    const sortedKeys = useMemo(() => {
        return Object.keys(groupedEntries).sort((a, b) => a.localeCompare(b, 'ja'))
    }, [groupedEntries])

    return (
        <>
            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="用語を検索..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
            </div>

            <div className="space-y-8">
                {sortedKeys.map(key => (
                    <section key={key}>
                        <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">
                            {key}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {groupedEntries[key].map(entry => (
                                <Link
                                    key={entry.slug}
                                    href={entry.route}
                                    className="block p-4 rounded-lg border border-border hover:border-foreground/20 hover:bg-secondary/50 transition-colors"
                                >
                                    <h3 className="font-medium mb-1">{entry.term}</h3>
                                    {entry.aliases.length > 0 && (
                                        <p className="text-sm text-muted-foreground">
                                            {entry.aliases.slice(0, 3).join(', ')}
                                        </p>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>

            {filteredEntries.length === 0 && query.trim() && (
                <div className="text-center py-12 text-muted-foreground">
                    「{query}」に一致する用語が見つかりませんでした。
                </div>
            )}

            {entries.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    まだ用語が登録されていません。
                </div>
            )}
        </>
    )
}
