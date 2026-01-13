import Link from 'next/link'
import { getDictionaryEntries } from '@/lib/get-dictionary'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '用語辞典',
    description: 'プログラミング用語の解説一覧',
}

export default async function DictionaryPage() {
    const entries = await getDictionaryEntries()

    // Group entries by first character
    const groupedEntries = entries.reduce((acc, entry) => {
        const firstChar = entry.term.charAt(0).toUpperCase()
        if (!acc[firstChar]) {
            acc[firstChar] = []
        }
        acc[firstChar].push(entry)
        return acc
    }, {} as Record<string, typeof entries>)

    const sortedKeys = Object.keys(groupedEntries).sort((a, b) => a.localeCompare(b, 'ja'))

    return (
        <div className="container py-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    用語辞典
                </h1>
                <p className="text-muted-foreground">
                    プログラミング学習に役立つ用語の解説集です。記事内でハイライトされた用語をクリックすると、ここにある解説が表示されます。
                </p>
            </header>

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

            {entries.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    まだ用語が登録されていません。
                </div>
            )}
        </div>
    )
}
