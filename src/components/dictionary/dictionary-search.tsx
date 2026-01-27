'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import type { DictionaryEntry } from '@/lib/get-dictionary'

// ひらがなを行（あ行、か行...）に変換
function getHiraganaRow(char: string): string {
    const hiraganaRows: Record<string, string> = {
        // あ行
        'あ': 'あ', 'い': 'あ', 'う': 'あ', 'え': 'あ', 'お': 'あ',
        // か行
        'か': 'か', 'き': 'か', 'く': 'か', 'け': 'か', 'こ': 'か',
        'が': 'か', 'ぎ': 'か', 'ぐ': 'か', 'げ': 'か', 'ご': 'か',
        // さ行
        'さ': 'さ', 'し': 'さ', 'す': 'さ', 'せ': 'さ', 'そ': 'さ',
        'ざ': 'さ', 'じ': 'さ', 'ず': 'さ', 'ぜ': 'さ', 'ぞ': 'さ',
        // た行
        'た': 'た', 'ち': 'た', 'つ': 'た', 'て': 'た', 'と': 'た',
        'だ': 'た', 'ぢ': 'た', 'づ': 'た', 'で': 'た', 'ど': 'た',
        // な行
        'な': 'な', 'に': 'な', 'ぬ': 'な', 'ね': 'な', 'の': 'な',
        // は行
        'は': 'は', 'ひ': 'は', 'ふ': 'は', 'へ': 'は', 'ほ': 'は',
        'ば': 'は', 'び': 'は', 'ぶ': 'は', 'べ': 'は', 'ぼ': 'は',
        'ぱ': 'は', 'ぴ': 'は', 'ぷ': 'は', 'ぺ': 'は', 'ぽ': 'は',
        // ま行
        'ま': 'ま', 'み': 'ま', 'む': 'ま', 'め': 'ま', 'も': 'ま',
        // や行
        'や': 'や', 'ゆ': 'や', 'よ': 'や',
        // ら行
        'ら': 'ら', 'り': 'ら', 'る': 'ら', 'れ': 'ら', 'ろ': 'ら',
        // わ行
        'わ': 'わ', 'を': 'わ', 'ん': 'わ',
    }
    return hiraganaRows[char] || char
}

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

    // Group entries by first character of reading (hiragana)
    const groupedEntries = useMemo(() => {
        return filteredEntries.reduce((acc, entry) => {
            const firstChar = entry.reading.charAt(0)
            // ひらがなを行（あ行、か行...）に変換
            const indexChar = getHiraganaRow(firstChar)
            if (!acc[indexChar]) {
                acc[indexChar] = []
            }
            acc[indexChar].push(entry)
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
